'use client';

import { useState, useEffect } from 'react';
import { Category, DEFAULT_SCORE } from '@/data/categories';
import RatingSlider from './RatingSlider';
import styles from './CategoryRating.module.css';

interface CategoryRatingProps {
  category: Category;
  value: number | { [subId: string]: number } | undefined;
  onChange: (value: number | { [subId: string]: number }) => void;
}

export default function CategoryRating({ category, value, onChange }: CategoryRatingProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getWeightPercentage = (weight: number) => Math.round(weight * 100);

  if (category.subPrinciples && category.subPrinciples.length > 0) {
    // Design Integrity with sub-principles
    const subValues = (value as { [subId: string]: number }) || {};
    
    const handleSubChange = (subId: string, subValue: number) => {
      onChange({
        ...subValues,
        [subId]: subValue
      });
    };

    const getAverage = () => {
      const values = Object.values(subValues);
      if (values.length === 0) return DEFAULT_SCORE;
      
      const functionality = subValues['functionality'] || DEFAULT_SCORE;
      const durability = subValues['durability'] || DEFAULT_SCORE;
      let avg = values.reduce((a, b) => a + b, 0) / values.length;
      
      if (functionality < 4 || durability < 4) {
        avg = Math.min(avg, 4);
      }
      
      return Math.round(avg * 10) / 10;
    };

    const hasCriticalFailure = 
      (subValues['functionality'] !== undefined && subValues['functionality'] < 4) ||
      (subValues['durability'] !== undefined && subValues['durability'] < 4);

    return (
      <div className={`${styles.category} ${hasCriticalFailure ? styles.criticalFailure : ''}`}>
        <div 
          className={styles.categoryHeader}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={styles.categoryInfo}>
            <h3 className={styles.categoryName}>
              {category.name}
              <span className={styles.weight}>{getWeightPercentage(category.weight)}%</span>
            </h3>
            <p className={styles.categoryDescription}>{category.description}</p>
          </div>
          <div className={styles.categoryScore}>
            <span className={styles.scoreValue}>{getAverage()}</span>
            <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
          </div>
        </div>

        {hasCriticalFailure && (
          <div className={styles.criticalWarning}>
            ⚠️ Critical Failure: Score capped at 4 due to low Functionality or Durability
          </div>
        )}

        {isExpanded && (
          <div className={styles.subPrinciples}>
            <div className={styles.anchors}>
              <div className={styles.anchor}><span className={styles.anchorDot} style={{background: '#22c55e'}}></span>{category.scoringAnchors.high}</div>
              <div className={styles.anchor}><span className={styles.anchorDot} style={{background: '#f59e0b'}}></span>{category.scoringAnchors.medium}</div>
              <div className={styles.anchor}><span className={styles.anchorDot} style={{background: '#ef4444'}}></span>{category.scoringAnchors.low}</div>
            </div>
            
            <div className={styles.subGrid}>
              {category.subPrinciples.map(sub => (
                <RatingSlider
                  key={sub.id}
                  label={sub.name}
                  description={sub.description}
                  value={subValues[sub.id] || DEFAULT_SCORE}
                  onChange={(v) => handleSubChange(sub.id, v)}
                  isCritical={sub.id === 'functionality' || sub.id === 'durability'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Simple category with single rating
  const simpleValue = (value as number) || DEFAULT_SCORE;

  return (
    <div className={styles.category}>
      <div 
        className={styles.categoryHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.categoryInfo}>
          <h3 className={styles.categoryName}>
            {category.name}
            <span className={styles.weight}>{getWeightPercentage(category.weight)}%</span>
          </h3>
          <p className={styles.categoryDescription}>{category.description}</p>
        </div>
        <div className={styles.categoryScore}>
          <span className={styles.scoreValue}>{simpleValue}</span>
          <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.ratingContent}>
          <div className={styles.anchors}>
            <div className={styles.anchor}><span className={styles.anchorDot} style={{background: '#22c55e'}}></span>{category.scoringAnchors.high}</div>
            <div className={styles.anchor}><span className={styles.anchorDot} style={{background: '#f59e0b'}}></span>{category.scoringAnchors.medium}</div>
            <div className={styles.anchor}><span className={styles.anchorDot} style={{background: '#ef4444'}}></span>{category.scoringAnchors.low}</div>
          </div>
          
          <RatingSlider
            label="Your Rating"
            value={simpleValue}
            onChange={(v) => onChange(v)}
          />
        </div>
      )}
    </div>
  );
}
