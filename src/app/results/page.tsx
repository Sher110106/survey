'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, BarChart2, FileText, Info, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { useSurvey } from '@/hooks/useSurvey';
import ResultsChart from '@/components/ResultsChart';
import styles from './page.module.css';

export default function ResultsPage() {
  const { getAllScores, resetSurvey, isHydrated } = useSurvey();
  const [scores, setScores] = useState<ReturnType<typeof getAllScores>>([]);

  useEffect(() => {
    if (isHydrated) {
      setScores(getAllScores());
    }
  }, [isHydrated, getAllScores]);

  if (!isHydrated) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading results...</p>
        </div>
      </main>
    );
  }

  const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);
  const topIdea = sortedScores[0];
  const averageScore = scores.length > 0 
    ? (scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length).toFixed(1)
    : '10.0';

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all ratings? This cannot be undone.')) {
      resetSurvey();
      window.location.reload();
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <ArrowLeft size={16} strokeWidth={2} />
          Home
        </Link>
        <h1 className={styles.title}>Survey Results</h1>
        <Link href="/survey" className={styles.surveyLink}>
          Continue Survey
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </header>

      <div className={styles.container}>
        <section className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <span className={styles.cardIcon}>
              <Trophy size={24} strokeWidth={1.5} />
            </span>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Top Rated Concept</span>
              <span className={styles.cardValue}>{topIdea?.name || 'N/A'}</span>
              <span className={styles.cardScore}>{topIdea?.totalScore.toFixed(1) || '10.0'}/10</span>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <span className={styles.cardIcon}>
              <BarChart2 size={24} strokeWidth={1.5} />
            </span>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Average Score</span>
              <span className={styles.cardValue}>{averageScore}/10</span>
              <span className={styles.cardSubtext}>Across all concepts</span>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <span className={styles.cardIcon}>
              <FileText size={24} strokeWidth={1.5} />
            </span>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Ideas Reviewed</span>
              <span className={styles.cardValue}>{scores.length}</span>
              <span className={styles.cardSubtext}>Sustainable concepts</span>
            </div>
          </div>
        </section>

        <section className={styles.infoNote}>
          <div className={styles.noteIcon}>
            <Info size={18} strokeWidth={1.5} />
          </div>
          <div className={styles.noteContent}>
            <strong>Note:</strong> All ideas default to 10/10 until rated. As you rate each concept 
            in the survey, the scores will update to reflect your actual ratings.
          </div>
        </section>

        <section className={styles.rankingSection}>
          <h2>Concept Rankings</h2>
          <p className={styles.sectionDescription}>
            Ideas ranked by weighted score: Retrofit (30%) + Design Integrity (30%) + Net-Zero Impact (30%) + Feasibility (10%)
          </p>
          <ResultsChart scores={scores} />
        </section>

        <section className={styles.actions}>
          <button onClick={handleReset} className={styles.resetButton}>
            <RefreshCw size={16} strokeWidth={2} />
            Reset All Ratings
          </button>
        </section>
      </div>
    </main>
  );
}
