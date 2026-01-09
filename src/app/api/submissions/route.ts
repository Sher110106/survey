import { NextRequest, NextResponse } from 'next/server';

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b';

// Helper to clean environment variables (removes accidental quotes, backslashes, and whitespace)
const cleanEnvVar = (val: string | undefined): string | undefined => {
  if (!val) return undefined;
  // Remove wrapping quotes and any leading/trailing whitespace
  return val.trim().replace(/^["']|["']$/g, '').replace(/\\/g, '');
};

const RAW_MASTER_KEY = process.env.JSONBIN_ACCESS_KEY;
const MASTER_KEY = cleanEnvVar(RAW_MASTER_KEY);

const RAW_BIN_ID = process.env.JSONBIN_BIN_ID;
const BIN_ID = cleanEnvVar(RAW_BIN_ID);

interface Submission {
  id: string;
  timestamp: string;
  ratings: Record<number, Record<string, number | Record<string, number>>>;
}

interface SubmissionsData {
  submissions: Submission[];
  totalCount: number;
  lastUpdated: string;
}

const getInitialData = (): SubmissionsData => ({
  submissions: [],
  totalCount: 0,
  lastUpdated: new Date().toISOString()
});

// Create a new bin if one doesn't exist
async function createBin(): Promise<string> {
  const response = await fetch(JSONBIN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': MASTER_KEY!,
      'X-Bin-Name': 'survey-submissions'
    },
    body: JSON.stringify(getInitialData())
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to create bin: ${response.statusText} - ${errorBody}`);
  }

  const result = await response.json();
  const newBinId = result.metadata.id;
  console.log('Created new JSONBin with ID:', newBinId);
  return newBinId;
}

// Read data from JSONBin
async function readData(): Promise<SubmissionsData> {
  if (!BIN_ID) {
    // If no bin ID, return initial data (bin will be created on first POST)
    return getInitialData();
  }

  const response = await fetch(`${JSONBIN_API_URL}/${BIN_ID}/latest`, {
    method: 'GET',
    headers: {
      'X-Master-Key': MASTER_KEY!
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`JSONBin Fetch Error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const result = await response.json();
  return result.record as SubmissionsData;
}

// Write data to JSONBin
async function writeData(data: SubmissionsData, binId?: string): Promise<void> {
  const targetBinId = binId || BIN_ID;
  
  if (!targetBinId) {
    throw new Error('No bin ID available');
  }

  const response = await fetch(`${JSONBIN_API_URL}/${targetBinId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': MASTER_KEY!
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to write to JSONBin: ${response.statusText}`);
  }
}

// GET - Retrieve all submissions
export async function GET() {
  try {
    if (!MASTER_KEY) {
      return NextResponse.json({ error: 'JSONBIN_ACCESS_KEY not configured' }, { status: 500 });
    }

    if (!BIN_ID) {
      return NextResponse.json({ error: 'JSONBIN_BIN_ID not configured' }, { status: 500 });
    }

    const data = await readData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading submissions:', error);
    return NextResponse.json({ 
      error: 'Failed to read submissions',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Add a new submission
export async function POST(request: NextRequest) {
  try {
    if (!MASTER_KEY) {
      return NextResponse.json({ error: 'X_MASTER_KEY not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { ratings } = body;

    if (!ratings || typeof ratings !== 'object') {
      return NextResponse.json({ error: 'Invalid ratings data' }, { status: 400 });
    }

    let currentBinId = BIN_ID;
    
    // Create bin if it doesn't exist
    if (!currentBinId) {
      currentBinId = await createBin();
    }

    const data = await readData();
    
    const newSubmission: Submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ratings
    };

    data.submissions.push(newSubmission);
    data.totalCount = data.submissions.length;
    data.lastUpdated = new Date().toISOString();

    await writeData(data, currentBinId);

    return NextResponse.json({ 
      success: true, 
      submissionId: newSubmission.id,
      totalCount: data.totalCount 
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}

// DELETE - Reset all submissions
export async function DELETE() {
  try {
    if (!MASTER_KEY) {
      return NextResponse.json({ error: 'X_MASTER_KEY not configured' }, { status: 500 });
    }

    if (!BIN_ID) {
      return NextResponse.json({ error: 'No bin configured to reset' }, { status: 400 });
    }

    const resetData = getInitialData();
    await writeData(resetData);

    return NextResponse.json({ 
      success: true, 
      message: 'All submissions have been reset' 
    });
  } catch (error) {
    console.error('Error resetting submissions:', error);
    return NextResponse.json({ error: 'Failed to reset submissions' }, { status: 500 });
  }
}
