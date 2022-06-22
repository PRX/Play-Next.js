/**
 *  @file [series].tsx
 * Landing page for a series, list of recent episodes
 *
 */
import styles from '@styles/Series.module.scss';
import PrxLogo from '@svg/prx-logo.svg';

const SeriesPage = () => {
  console.log();
  return (
    <div>
      <div className={styles.root}>
        <div className={styles.logoBar}>
          <PrxLogo className={styles.prxLogo} />
        </div>
        <div className={styles.header}>{/* Header element */}</div>

        <div className={styles.episodeContainer}>
          <h2 className={styles.content}>Latest Episodes</h2>
          {/* episode section */}
          <div className={styles.episodeBox}>
            <h3 className={styles.episodeDate}>07/22</h3>
            <h4 className={styles.episodeTitle}>Title One</h4>
            <span className={styles.episodeTeaser}>Episode Teaser</span>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>{/* Footer */}</footer>
    </div>
  );
};

export default SeriesPage;
