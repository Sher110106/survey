'use client';

import { Bot, Check, X } from 'lucide-react';
import { Idea } from '@/data/ideas';
import styles from './IdeaCard.module.css';

interface IdeaCardProps {
  idea: Idea;
  index: number;
  total: number;
}

export default function IdeaCard({ idea, index, total }: IdeaCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.counter}>
          Idea {index + 1} of {total}
        </span>
        <h2 className={styles.title}>{idea.name}</h2>
      </div>
      
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <img 
            src={idea.image} 
            alt={idea.name}
            className={styles.image}
          />
        </div>
        
        <div className={styles.details}>
          <p className={styles.description}>{idea.description}</p>
          
          <div className={styles.automationContext}>
            <span className={styles.automationLabel}>
              <Bot size={14} strokeWidth={1.5} />
              Automation Potential
            </span>
            <p>{idea.automationContext}</p>
          </div>
          
          <div className={styles.prosConsContainer}>
            <div className={styles.prosSection}>
              <h4 className={styles.prosTitle}>
                <Check size={14} strokeWidth={2} />
                Pros
              </h4>
              <ul className={styles.list}>
                {idea.pros.map((pro, i) => (
                  <li key={i} className={styles.proItem}>{pro}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.consSection}>
              <h4 className={styles.consTitle}>
                <X size={14} strokeWidth={2} />
                Cons
              </h4>
              <ul className={styles.list}>
                {idea.cons.map((con, i) => (
                  <li key={i} className={styles.conItem}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
