'use client';

import styles from './ResultsChart.module.css';

interface IdeaScore {
  id: number;
  name: string;
  totalScore: number;
  categoryScores: { [key: string]: number };
}

interface ResultsChartProps {
  scores: IdeaScore[];
}

const categoryLabels: { [key: string]: string } = {
  retrofit: 'Retrofit',
  design: 'Design',
  netzero: 'Net-Zero',
  feasibility: 'Feasibility'
};

export default function ResultsChart({ scores }: ResultsChartProps) {
  const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);
  const maxScore = 10;

  const getScoreColor = (score: number) => {
    if (score <= 3) return '#ef4444';
    if (score <= 5) return '#f59e0b';
    if (score <= 7) return '#eab308';
    if (score <= 8.5) return '#84cc16';
    return '#22c55e';
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return { emoji: '🥇', label: '1st' };
    if (index === 1) return { emoji: '🥈', label: '2nd' };
    if (index === 2) return { emoji: '🥉', label: '3rd' };
    return { emoji: '', label: `${index + 1}th` };
  };

  return (
    <div className={styles.container}>
      <div className={styles.rankingList}>
        {sortedScores.map((score, index) => {
          const rank = getRankBadge(index);
          const percentage = (score.totalScore / maxScore) * 100;
          
          return (
            <div 
              key={score.id} 
              className={`${styles.rankItem} ${index < 3 ? styles.topThree : ''}`}
            >
              <div className={styles.rankInfo}>
                <span className={styles.rank}>
                  {rank.emoji} {rank.label}
                </span>
                <span className={styles.ideaName}>{score.name}</span>
              </div>
              
              <div className={styles.scoreBar}>
                <div 
                  className={styles.scoreBarFill}
                  style={{ 
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${getScoreColor(score.totalScore)}, ${getScoreColor(score.totalScore)}88)`
                  }}
                />
                <span className={styles.scoreValue}>
                  {score.totalScore.toFixed(1)}
                </span>
              </div>

              <div className={styles.categoryBreakdown}>
                {Object.entries(score.categoryScores).map(([catId, catScore]) => (
                  <div key={catId} className={styles.categoryChip}>
                    <span className={styles.categoryLabel}>{categoryLabels[catId]}</span>
                    <span 
                      className={styles.categoryValue}
                      style={{ color: getScoreColor(catScore) }}
                    >
                      {catScore.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.legend}>
        <h4 className={styles.legendTitle}>Score Legend</h4>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: '#22c55e' }}></span>
            <span>Excellent (8.5-10)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: '#84cc16' }}></span>
            <span>Very Good (7-8.5)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: '#eab308' }}></span>
            <span>Good (5-7)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: '#f59e0b' }}></span>
            <span>Fair (3-5)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendColor} style={{ background: '#ef4444' }}></span>
            <span>Poor (1-3)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
