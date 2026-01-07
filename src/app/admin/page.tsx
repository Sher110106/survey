'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, Users, FileText, Star, Clock, 
  Inbox, TrendingUp, Trophy, ClipboardList, 
  Settings, Download, Trash2, Database, AlertTriangle,
  RefreshCw, ArrowLeft
} from 'lucide-react';
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
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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

  const handleDownloadJSON = async () => {
    try {
      const response = await fetch('/api/submissions');
      if (!response.ok) throw new Error('Failed to fetch data');
      const jsonData = await response.json();
      
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `survey-results-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download JSON data');
    }
  };

  const handleResetResults = async () => {
    try {
      setIsResetting(true);
      const response = await fetch('/api/submissions', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to reset results');
      setShowResetModal(false);
      await fetchResults();
    } catch (err) {
      console.error('Reset failed:', err);
      alert('Failed to reset results');
    } finally {
      setIsResetting(false);
    }
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return '1st';
    if (index === 1) return '2nd';
    if (index === 2) return '3rd';
    return `${index + 1}th`;
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
      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <AlertTriangle size={32} strokeWidth={1.5} />
            </div>
            <h3 className={styles.modalTitle}>Reset All Results?</h3>
            <p className={styles.modalText}>
              This action will permanently delete all survey submissions. 
              This cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmButton}
                onClick={handleResetResults}
                disabled={isResetting}
              >
                {isResetting ? 'Resetting...' : 'Yes, Reset All'}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <ArrowLeft size={16} strokeWidth={2} />
          Home
        </Link>
        <h1 className={styles.title}>
          <BarChart3 size={20} strokeWidth={2} />
          Results Dashboard
        </h1>
        <div className={styles.headerActions}>
          <button onClick={fetchResults} className={styles.refreshButton}>
            <RefreshCw size={14} strokeWidth={2} />
            Refresh
          </button>
        </div>
      </header>

      <div className={styles.container}>
        {/* Stats Overview */}
        <section className={styles.statsOverview}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users size={24} strokeWidth={1.5} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{data.stats.totalRespondents}</span>
              <span className={styles.statLabel}>Total Respondents</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FileText size={24} strokeWidth={1.5} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{data.stats.totalSubmissions}</span>
              <span className={styles.statLabel}>Total Submissions</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Star size={24} strokeWidth={1.5} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{data.stats.averageScoreAcrossAll.toFixed(1)}</span>
              <span className={styles.statLabel}>Average Score</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Clock size={24} strokeWidth={1.5} />
            </div>
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
            <div className={styles.emptyIcon}>
              <Inbox size={48} strokeWidth={1} />
            </div>
            <h2>No Submissions Yet</h2>
            <p>When participants complete the survey, their responses will appear here with aggregated rankings.</p>
            <Link href="/survey" className={styles.startSurveyButton}>
              Take the Survey
            </Link>
          </section>
        )}

        {/* Category Averages */}
        <section className={styles.categorySection}>
          <h2>
            <TrendingUp size={18} strokeWidth={2} />
            Category Averages
          </h2>
          <div className={styles.categoryGrid}>
            {Object.entries(data.stats.categoryOveralls).map(([catId, cat]) => (
              <div key={catId} className={styles.categoryCard}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>{cat.name}</span>
                  <span className={styles.categoryWeight}>{Math.round(cat.weight * 100)}%</span>
                </div>
                <div className={styles.categoryScore}>
                  {cat.average.toFixed(1)}
                </div>
                <div className={styles.categoryBar}>
                  <div 
                    className={styles.categoryBarFill}
                    style={{ width: `${(cat.average / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Idea Rankings */}
        <section className={styles.rankingsSection}>
          <h2>
            <Trophy size={18} strokeWidth={2} />
            Idea Rankings
          </h2>
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
                  <span key={catId} className={styles.colCategory}>
                    {idea.categoryAverages[catId]?.toFixed(1) || '10.0'}
                  </span>
                ))}
                <span className={styles.colScore}>
                  <span className={styles.scoreValue}>
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
            <h2>
              <ClipboardList size={18} strokeWidth={2} />
              Recent Submissions
            </h2>
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

        {/* Admin Actions */}
        <section className={styles.adminActionsSection}>
          <h3>
            <Settings size={16} strokeWidth={2} />
            Admin Actions
          </h3>
          <div className={styles.actionButtons}>
            <button 
              className={styles.downloadButton}
              onClick={handleDownloadJSON}
            >
              <Download size={16} strokeWidth={2} />
              Download JSON
            </button>
            <button 
              className={styles.resetButton}
              onClick={() => setShowResetModal(true)}
            >
              <Trash2 size={16} strokeWidth={2} />
              Reset Results
            </button>
          </div>
        </section>

        {/* Export Info */}
        <section className={styles.exportSection}>
          <h3>
            <Database size={16} strokeWidth={2} />
            Data Storage
          </h3>
          <p>All submissions are stored in: <code>data/submissions.json</code></p>
          <p>Use the API endpoint <code>/api/results</code> to fetch aggregated data programmatically.</p>
        </section>
      </div>
    </main>
  );
}
