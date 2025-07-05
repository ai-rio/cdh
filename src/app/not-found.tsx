import Link from 'next/link'
import { SignalLostAnimation } from '@/components/special/SignalLostAnimation'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.pageWrapper}>
      {/* Global styles using dangerouslySetInnerHTML */}
      <style dangerouslySetInnerHTML={{
        __html: `
          html, body {
            background-color: #000000 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        `
      }} />
      
      {/* Mission Control HUD */}
      <header className={styles.missionControlHud}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2.66663C8.63636 2.66663 2.66669 8.63632 2.66669 16C2.66669 23.3636 8.63636 29.3333 16 29.3333C23.3637 29.3333 29.3334 23.3636 29.3334 16C29.3334 8.63632 23.3637 2.66663 16 2.66663Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21.3333 10.6667L10.6667 21.3334" stroke="#A3E635" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.6667 10.6667L21.3333 21.3334" stroke="#A3E635" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.logoText}>CDH</span>
          </Link>
        </nav>
      </header>

      {/* Background Animation */}
      <SignalLostAnimation />

      {/* Main Page Content */}
      <div className={styles.contentContainer}>
        <div className={styles.holoPanel}>
          <h1 className={styles.glitchText}>404</h1>
          <h2 className={styles.subtitle}>Signal Lost: Trajectory Anomaly</h2>
          <p className={styles.description}>
            You&apos;ve discovered an uncharted sector of the constellation. The data stream is unstable here, but our command center is still online.
          </p>
          <Link href="/" className={styles.ctaButton}>
            Re-establish Connection
          </Link>
        </div>
      </div>
    </div>
  )
}
