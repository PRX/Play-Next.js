/**
 * @file [episodeId].tsx
 * Landing page to listen to individual episode.
 */

import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import styles from '@styles/Listen.module.scss';
import PrxLogo from '@svg/prx-logo.svg';
import parseEmbedParamsToConfig from '@lib/parse/config/parseEmbedParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';

const ListenPage = ({ episodeId }) => {
  console.log(episodeId);
  return (
    <>
      <div className={styles.root}>
        <Head>
          <style>{`body{background-color: ${styles.bodyColor}; }`}</style>
        </Head>

        <div className={styles.logoBar}>
          {/* Logo bar */}
          <PrxLogo className={styles.prxLogo} />
        </div>

        <header className={styles.header}>{/* Header */}</header>

        <div className={styles.content}>
          {/* Main Content */}
          <h2>hello world {episodeId}</h2>
          <p className={styles.contentText}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
            totam ratione accusamus, asperiores soluta, inventore aut minima
            sunt, maiores vero fuga eius! Esse laboriosam beatae quod modi velit
            pariatur doloremque. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Qui ipsam quisquam laudantium doloribus in rerum
            officiis dolor fugiat sunt, sequi adipisci recusandae dolores
            molestiae. Alias sint fugit omnis blanditiis ab!
          </p>
        </div>
      </div>
      <footer className={styles.footer}>{/* footer */}</footer>
    </>
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

export default ListenPage;
