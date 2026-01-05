'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface CategoryStats {
  name: string;
  weight: number;
  average: number;
}

interface IdeaRanking {
  id: number;
  name: string;
  avgScore: number;
  totalRatings: number;
  categoryAverages: Record<string, number>;
}

interface OverallStats {
  totalRespondents: number;
  totalSubmissions: number;
  lastUpdated: string;
  averageScoreAcrossAll: number;
  categoryOveralls: Record<string, CategoryStats>;
}

interface RecentSubmission {
  id: string;
  timestamp: string;
}

interface AggregatedResults {
  stats: OverallStats;
  ideaRankings: IdeaRanking[];
  recentSubmissions: RecentSubmission[];
}

const categoryLabels: Record<string, string> = {
  retrofit: 'Retrofit',
  design: 'Design',
  netzero: 'Net-Zero',
  feasibility: 'Feasibility'
};

export default function AdminResultsPage() {
  const [data, setData] = useState<AggregatedResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/results');
      if (!response.ok) throw new Error('Failed to fetch results');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 3) return '#ef4444';
    if (score <= 5) return '#f59e0b';
    if (score <= 7) return '#eab308';
    if (score <= 8.5) return '#84cc16';
    return '#22c55e';
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading aggregated results...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchResults} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const hasSubmissions = data.stats.totalRespondents > 0;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          ← Home
        </Link>
        <h1 className={styles.title}>📊 Overall Results Dashboard</h1>
        <button onClick={fetchResults} className={styles.refreshButton}>
          🔄 Refresh
        </button>
      </header>

      <div className={styles.container}>
        {/* Stats Overview */}
        <section className={styles.statsOverview}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{data.stats.totalRespondents}</span>
              <span className={styles.statLabel}>Total Respondents</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📝</div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{data.stats.totalSubmissions}</span>
              <span className={styles.statLabel}>Total Submissions</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{data.stats.averageScoreAcrossAll.toFixed(1)}</span>
              <span className={styles.statLabel}>Average Score</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🕐</div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>
                {formatDate(data.stats.lastUpdated).split(',')[0]}
              </span>
              <span className={styles.statLabel}>Last Updated</span>
            </div>
          </div>
        </section>

        {!hasSubmissions && (
          <section className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h2>No Submissions Yet</h2>
            <p>When participants complete the survey, their responses will appear here with aggregated rankings.</p>
            <Link href="/survey" className={styles.startSurveyButton}>
              Take the Survey →
            </Link>
          </section>
        )}

        {/* Category Averages */}
        <section className={styles.categorySection}>
          <h2>📈 Category Averages Across All Ideas</h2>
          <div className={styles.categoryGrid}>
            {Object.entries(data.stats.categoryOveralls).map(([catId, cat]) => (
              <div key={catId} className={styles.categoryCard}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>{cat.name}</span>
                  <span className={styles.categoryWeight}>{Math.round(cat.weight * 100)}%</span>
                </div>
                <div 
                  className={styles.categoryScore}
                  style={{ color: getScoreColor(cat.average) }}
                >
                  {cat.average.toFixed(1)}
                </div>
                <div className={styles.categoryBar}>
                  <div 
                    className={styles.categoryBarFill}
                    style={{ 
                      width: `${(cat.average / 10) * 100}%`,
                      background: getScoreColor(cat.average)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Idea Rankings */}
        <section className={styles.rankingsSection}>
          <h2>🏆 Idea Rankings (by Average Score)</h2>
          <p className={styles.sectionSubtitle}>
            Ranked by weighted average: Retrofit (30%) + Design (30%) + Net-Zero (30%) + Feasibility (10%)
          </p>
          
          <div className={styles.rankingsTable}>
            <div className={styles.tableHeader}>
              <span className={styles.colRank}>Rank</span>
              <span className={styles.colName}>Idea Name</span>
              <span className={styles.colRatings}>Ratings</span>
              {Object.keys(categoryLabels).map(catId => (
                <span key={catId} className={styles.colCategory}>
                  {categoryLabels[catId]}
                </span>
              ))}
              <span className={styles.colScore}>Score</span>
            </div>
            
            {data.ideaRankings.map((idea, index) => (
              <div 
                key={idea.id} 
                className={`${styles.tableRow} ${index < 3 ? styles.topThree : ''}`}
              >
                <span className={styles.colRank}>
                  <span className={styles.rankBadge}>{getRankBadge(index)}</span>
                </span>
                <span className={styles.colName}>{idea.name}</span>
                <span className={styles.colRatings}>
                  <span className={styles.ratingCount}>{idea.totalRatings}</span>
                </span>
                {Object.keys(categoryLabels).map(catId => (
                  <span 
                    key={catId} 
                    className={styles.colCategory}
                    style={{ color: getScoreColor(idea.categoryAverages[catId]) }}
                  >
                    {idea.categoryAverages[catId]?.toFixed(1) || '10.0'}
                  </span>
                ))}
                <span className={styles.colScore}>
                  <span 
                    className={styles.scoreValue}
                    style={{ color: getScoreColor(idea.avgScore) }}
                  >
                    {idea.avgScore.toFixed(1)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Submissions */}
        {data.recentSubmissions.length > 0 && (
          <section className={styles.recentSection}>
            <h2>📋 Recent Submissions</h2>
            <div className={styles.recentList}>
              {data.recentSubmissions.map(sub => (
                <div key={sub.id} className={styles.recentItem}>
                  <span className={styles.recentId}>{sub.id.slice(0, 20)}...</span>
                  <span className={styles.recentTime}>{formatDate(sub.timestamp)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Export Info */}
        <section className={styles.exportSection}>
          <h3>💾 Data Storage</h3>
          <p>All submissions are stored in: <code>data/submissions.json</code></p>
          <p>Use the API endpoint <code>/api/results</code> to fetch aggregated data programmatically.</p>
        </section>
      </div>
    </main>
  );
}
