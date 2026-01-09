import { NextResponse } from 'next/server';
import { ideas } from '@/data/ideas';
import { categories, DEFAULT_SCORE } from '@/data/categories';

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b';

// Helper to clean environment variables
const cleanEnvVar = (val: string | undefined): string | undefined => {
  if (!val) return undefined;
  return val.trim().replace(/^["']|["']$/g, '').replace(/\\/g, '');
};

const MASTER_KEY = cleanEnvVar(process.env.JSONBIN_ACCESS_KEY);
const BIN_ID = cleanEnvVar(process.env.JSONBIN_BIN_ID);

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

interface IdeaStats {
  id: number;
  name: string;
  avgScore: number;
  totalRatings: number;
  categoryAverages: Record<string, number>;
}

async function getSubmissions(): Promise<SubmissionsData> {
  if (!MASTER_KEY || !BIN_ID) {
    return { submissions: [], totalCount: 0, lastUpdated: new Date().toISOString() };
  }

  try {
    const response = await fetch(`${JSONBIN_API_URL}/${BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': MASTER_KEY
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Failed to read from JSONBin:', response.statusText);
      return { submissions: [], totalCount: 0, lastUpdated: new Date().toISOString() };
    }

    const result = await response.json();
    return result.record as SubmissionsData;
  } catch (error) {
    console.error('Error fetching from JSONBin:', error);
    return { submissions: [], totalCount: 0, lastUpdated: new Date().toISOString() };
  }
}

function calculateCategoryScore(rating: number | Record<string, number> | undefined): number {
  if (rating === undefined) return DEFAULT_SCORE;
  if (typeof rating === 'number') return rating;
  
  // Design Integrity with sub-principles
  const values = Object.values(rating);
  if (values.length === 0) return DEFAULT_SCORE;
  
  const functionality = rating['functionality'] || DEFAULT_SCORE;
  const durability = rating['durability'] || DEFAULT_SCORE;
  let avg = values.reduce((a, b) => a + b, 0) / values.length;
  
  if (functionality < 4 || durability < 4) {
    avg = Math.min(avg, 4);
  }
  
  return avg;
}

function calculateWeightedScore(ideaRatings: Record<string, number | Record<string, number>>): number {
  let total = 0;
  for (const cat of categories) {
    const score = calculateCategoryScore(ideaRatings[cat.id]);
    total += score * cat.weight;
  }
  return Math.round(total * 10) / 10;
}

export async function GET() {
  try {
    const data = await getSubmissions();
    
    // Aggregate statistics for each idea
    const ideaStats: IdeaStats[] = ideas.map(idea => {
      const ideaRatings = data.submissions
        .filter(sub => sub.ratings[idea.id])
        .map(sub => sub.ratings[idea.id]);
      
      const totalRatings = ideaRatings.length;
      
      if (totalRatings === 0) {
        return {
          id: idea.id,
          name: idea.name,
          avgScore: DEFAULT_SCORE,
          totalRatings: 0,
          categoryAverages: categories.reduce((acc, cat) => ({
            ...acc,
            [cat.id]: DEFAULT_SCORE
          }), {})
        };
      }
      
      // Calculate category averages
      const categoryAverages: Record<string, number> = {};
      for (const cat of categories) {
        const scores = ideaRatings.map(r => calculateCategoryScore(r[cat.id]));
        categoryAverages[cat.id] = Math.round(
          (scores.reduce((a, b) => a + b, 0) / scores.length) * 10
        ) / 10;
      }
      
      // Calculate overall average
      const overallScores = ideaRatings.map(r => calculateWeightedScore(r));
      const avgScore = Math.round(
        (overallScores.reduce((a, b) => a + b, 0) / overallScores.length) * 10
      ) / 10;
      
      return {
        id: idea.id,
        name: idea.name,
        avgScore,
        totalRatings,
        categoryAverages
      };
    });
    
    // Sort by average score
    ideaStats.sort((a, b) => b.avgScore - a.avgScore);
    
    // Calculate overall statistics
    const overallStats = {
      totalRespondents: data.totalCount,
      totalSubmissions: data.submissions.length,
      lastUpdated: data.lastUpdated,
      averageScoreAcrossAll: ideaStats.length > 0
        ? Math.round((ideaStats.reduce((a, b) => a + b.avgScore, 0) / ideaStats.length) * 10) / 10
        : DEFAULT_SCORE,
      categoryOveralls: categories.reduce((acc, cat) => {
        const allCatScores = ideaStats.map(s => s.categoryAverages[cat.id]);
        return {
          ...acc,
          [cat.id]: {
            name: cat.name,
            weight: cat.weight,
            average: allCatScores.length > 0
              ? Math.round((allCatScores.reduce((a, b) => a + b, 0) / allCatScores.length) * 10) / 10
              : DEFAULT_SCORE
          }
        };
      }, {})
    };
    
    return NextResponse.json({
      stats: overallStats,
      ideaRankings: ideaStats,
      recentSubmissions: data.submissions.slice(-5).reverse().map(s => ({
        id: s.id,
        timestamp: s.timestamp
      }))
    });
  } catch (error) {
    console.error('Error aggregating results:', error);
    return NextResponse.json({ error: 'Failed to aggregate results' }, { status: 500 });
  }
}
