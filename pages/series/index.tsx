/**
 *  @file [series].tsx
 * Landing page for a series, list of recent episodes
 *
 */

import type { GetServerSideProps } from 'next';
import parseEmbedParamsToConfig from '@lib/parse/config/parseEmbedParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import AppBar from '@components/Page/AppBar/AppBar';
import styles from '@styles/Series.module.scss';

const SeriesPage = () => {
  console.log();
  return (
    <div className={styles.root}>
      <AppBar />
      <header className={styles.header}>{/* Header element */}</header>

      <div className={styles.content}>
        <h2>Latest Episodes</h2>
        {/* episode section */}
        <div className={styles.episodeBox}>
          <h3 className={styles.episodeDate}>07/22</h3>
          <h4 className={styles.episodeTitle}>Title One</h4>
          <span className={styles.episodeTeaser}>Episode Teaser</span>
        </div>
      </div>

      <footer className={styles.footer}>{/* Footer */}</footer>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // 1. Convert query params into embed config.
  const config = parseEmbedParamsToConfig(query);
  // 2. If RSS feed URL is provided.
  const rssData = config.feedUrl && (await fetchRssFeed(config.feedUrl));
  // 3. Parse config and RSS data into embed data.
  const data = parseEmbedData(config, rssData);

  return {
    props: { config, data }
  };
};

export default SeriesPage;
