'use client';

import { useState, useEffect } from 'react';
import styles from './RatingSlider.module.css';

interface RatingSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description?: string;
  isCritical?: boolean;
}

export default function RatingSlider({ 
  value, 
  onChange, 
  label, 
  description,
  isCritical = false 
}: RatingSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'var(--score-low)';
    if (score <= 6) return 'var(--score-medium)';
    return 'var(--score-high)';
  };

  const getScoreLabel = (score: number) => {
    if (score <= 3) return 'Poor';
    if (score <= 6) return 'Good';
    if (score <= 8) return 'Very Good';
    return 'Excellent';
  };

  const percentage = ((localValue - 1) / 9) * 100;

  return (
    <div className={`${styles.container} ${isCritical ? styles.critical : ''}`}>
      <div className={styles.header}>
        <label className={styles.label}>
          {label}
          {isCritical && <span className={styles.criticalBadge}>Critical</span>}
        </label>
        <div 
          className={styles.valueDisplay}
          style={{ '--score-color': getScoreColor(localValue) } as React.CSSProperties}
        >
          <span className={styles.value}>{localValue}</span>
          <span className={styles.valueLabel}>{getScoreLabel(localValue)}</span>
        </div>
      </div>
      
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      
      <div className={styles.sliderContainer}>
        <div 
          className={styles.sliderTrack}
          style={{ '--percentage': `${percentage}%` } as React.CSSProperties}
        >
          <input
            type="range"
            min="1"
            max="10"
            value={localValue}
            onChange={handleChange}
            className={styles.slider}
          />
        </div>
        <div className={styles.markers}>
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
