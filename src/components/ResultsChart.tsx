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

  const getRankLabel = (index: number) => {
    if (index === 0) return '1st';
    if (index === 1) return '2nd';
    if (index === 2) return '3rd';
    return `${index + 1}th`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.rankingList}>
        {sortedScores.map((score, index) => {
          const percentage = (score.totalScore / maxScore) * 100;
          
          return (
            <div 
              key={score.id} 
              className={`${styles.rankItem} ${index < 3 ? styles.topThree : ''}`}
            >
              <div className={styles.rankInfo}>
                <span className={styles.rank}>
                  {getRankLabel(index)}
                </span>
                <span className={styles.ideaName}>{score.name}</span>
              </div>
              
              <div className={styles.scoreBar}>
                <div 
                  className={styles.scoreBarFill}
                  style={{ width: `${percentage}%` }}
                />
                <span className={styles.scoreValue}>
                  {score.totalScore.toFixed(1)}
                </span>
              </div>

              <div className={styles.categoryBreakdown}>
                {Object.entries(score.categoryScores).map(([catId, catScore]) => (
                  <div key={catId} className={styles.categoryChip}>
                    <span className={styles.categoryLabel}>{categoryLabels[catId]}</span>
                    <span className={styles.categoryValue}>
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
        <h4 className={styles.legendTitle}>Score Range</h4>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <span className={styles.legendColor}></span>
            <span>Higher scores indicate better alignment with criteria</span>
          </div>
        </div>
      </div>
    </div>
  );
}
