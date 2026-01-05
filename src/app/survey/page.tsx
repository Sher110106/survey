'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSurvey } from '@/hooks/useSurvey';
import { categories } from '@/data/categories';
import IdeaCard from '@/components/IdeaCard';
import CategoryRating from '@/components/CategoryRating';
import styles from './page.module.css';

export default function SurveyPage() {
  const { 
    state,
    isHydrated,
    currentIdea, 
    totalIdeas,
    setRating,
    nextIdea,
    prevIdea,
    goToIdea,
    markComplete,
    calculateScore
  } = useSurvey();

  const [showNav, setShowNav] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isHydrated) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading survey...</p>
        </div>
      </main>
    );
  }

  const currentRatings = state.ratings[currentIdea.id] || {};
  const currentScore = calculateScore(currentIdea.id);
  const isLastIdea = state.currentIdeaIndex === totalIdeas - 1;
  const progress = ((state.currentIdeaIndex + 1) / totalIdeas) * 100;

  const handleCategoryChange = (categoryId: string, value: number | { [subId: string]: number }) => {
    setRating(currentIdea.id, categoryId, value);
  };


  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Submit to backend
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ratings: state.ratings })
      });
    } catch (error) {
      console.error('Failed to submit survey:', error);
    }
    markComplete();
    window.location.href = '/results';
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          ← Back to Home
        </Link>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {state.currentIdeaIndex + 1} of {totalIdeas}
          </span>
        </div>
        <Link href="/results" className={styles.resultsLink}>
          View Results →
        </Link>
      </header>

      <div className={styles.container}>
        <div className={styles.ideaNavWrapper}>
          <button 
            className={styles.navToggle}
            onClick={() => setShowNav(!showNav)}
          >
            {showNav ? 'Hide Ideas' : 'Show All Ideas'}
          </button>
          
          {showNav && (
            <div className={styles.ideaNav}>
              {Array.from({ length: totalIdeas }, (_, i) => (
                <button
                  key={i}
                  className={`${styles.ideaNavItem} ${i === state.currentIdeaIndex ? styles.active : ''} ${state.ratings[i + 1] ? styles.rated : ''}`}
                  onClick={() => {
                    goToIdea(i);
                    setShowNav(false);
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <IdeaCard 
          idea={currentIdea} 
          index={state.currentIdeaIndex}
          total={totalIdeas}
        />

        <div className={styles.ratingSection}>
          <div className={styles.ratingSectionHeader}>
            <h3>Rate This Concept</h3>
            <div className={styles.currentScore}>
              <span className={styles.scoreLabel}>Weighted Score</span>
              <span className={styles.scoreValue}>{currentScore}</span>
            </div>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map(category => (
              <CategoryRating
                key={category.id}
                category={category}
                value={currentRatings[category.id]}
                onChange={(value) => handleCategoryChange(category.id, value)}
              />
            ))}
          </div>
        </div>

        <div className={styles.navigation}>
          <button 
            className={styles.navButton}
            onClick={prevIdea}
            disabled={state.currentIdeaIndex === 0}
          >
            ← Previous
          </button>
          
          {isLastIdea ? (
            <button 
              className={`${styles.navButton} ${styles.primary}`}
              onClick={handleComplete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Survey ✓'}
            </button>
          ) : (
            <button 
              className={`${styles.navButton} ${styles.primary}`}
              onClick={nextIdea}
            >
              Next Idea →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
