import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');

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

async function ensureDataFile(): Promise<SubmissionsData> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    const initial: SubmissionsData = {
      submissions: [],
      totalCount: 0,
      lastUpdated: new Date().toISOString()
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
}

// GET - Retrieve all submissions
export async function GET() {
  try {
    const data = await ensureDataFile();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading submissions:', error);
    return NextResponse.json({ error: 'Failed to read submissions' }, { status: 500 });
  }
}

// POST - Add a new submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ratings } = body;

    if (!ratings || typeof ratings !== 'object') {
      return NextResponse.json({ error: 'Invalid ratings data' }, { status: 400 });
    }

    const data = await ensureDataFile();
    
    const newSubmission: Submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ratings
    };

    data.submissions.push(newSubmission);
    data.totalCount = data.submissions.length;
    data.lastUpdated = new Date().toISOString();

    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

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
    const resetData: SubmissionsData = {
      submissions: [],
      totalCount: 0,
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(DATA_FILE, JSON.stringify(resetData, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'All submissions have been reset' 
    });
  } catch (error) {
    console.error('Error resetting submissions:', error);
    return NextResponse.json({ error: 'Failed to reset submissions' }, { status: 500 });
  }
}
