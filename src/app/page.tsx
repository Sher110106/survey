import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>Energy Specialist Survey</div>
          <h1 className={styles.title}>
            Smart Blinds for a 
            <span className={styles.gradient}> Sustainable Future</span>
          </h1>
          <p className={styles.subtitle}>
            We&apos;re building motorized blinds that automatically adapt to temperature, 
            sunlight, and weather conditions — reducing energy consumption without 
            sacrificing comfort.
          </p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🌡️</span>
              <div>
                <h3>Temperature Aware</h3>
                <p>Lower blinds to preserve cool air, raise them to capture warmth</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>☁️</span>
              <div>
                <h3>Cloud Responsive</h3>
                <p>Smart adjustments prevent constant hunting when clouds pass</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⚡</span>
              <div>
                <h3>Energy Efficient</h3>
                <p>Minimize motor cycles while maximizing climate benefits</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.heroVisual}>
          <div className={styles.mockup}>
            <div className={styles.windowFrame}>
              <div className={styles.blindSlat} style={{ '--delay': '0s' } as React.CSSProperties}></div>
              <div className={styles.blindSlat} style={{ '--delay': '0.1s' } as React.CSSProperties}></div>
              <div className={styles.blindSlat} style={{ '--delay': '0.2s' } as React.CSSProperties}></div>
              <div className={styles.blindSlat} style={{ '--delay': '0.3s' } as React.CSSProperties}></div>
              <div className={styles.blindSlat} style={{ '--delay': '0.4s' } as React.CSSProperties}></div>
            </div>
            <div className={styles.sensorIndicator}>
              <span className={styles.sensorPulse}></span>
              <span className={styles.sensorLabel}>Sensing</span>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.aboutSurvey}>
        <h2>How This Survey Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Review 12 Concepts</h3>
            <p>Each idea represents a different approach to sustainable window shading — from passive thermal mechanisms to modular designs.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Rate on 4 Criteria</h3>
            <p>Score each concept on Retrofit ease, Design Integrity, Net-Zero Impact, and Feasibility — weighted to reflect real-world priorities.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>See Results</h3>
            <p>View aggregated scores to identify which concepts — or combinations — best suit our automated blind platform.</p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Your Expertise Matters</h2>
          <p>
            As an energy specialist, your evaluation will directly influence which 
            sustainable blind concepts we prioritize for our motorized automation platform.
          </p>
          <Link href="/survey" className={styles.startButton}>
            Start the Survey
            <span className={styles.arrow}>→</span>
          </Link>
          <Link href="/results" className={styles.resultsLink}>
            or view current results
          </Link>
        </div>
      </section>
    </main>
  );
}
