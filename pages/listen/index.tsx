/**
 * @file [episodeId].tsx
 * Landing page to listen to individual episode.
 */

import type { GetServerSideProps } from 'next';
import type { IPageProps } from '@interfaces/data/page';
import parseEmbedParamsToConfig from '@lib/parse/config/parseEmbedParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import AppBar from '@components/Page/AppBar/AppBar';
import styles from '@styles/Listen.module.scss';
import BackgroundImage from '@components/BackgroundImage/BackgroundImage';

export interface IListenPageProps extends IPageProps {}

const ListenPage = ({ data }: IListenPageProps) => {
  const { bgImageUrl } = data;
  return (
    <div className={styles.root}>
      <AppBar />

      <header className={styles.header}>
        <BackgroundImage
          imageUrl={bgImageUrl}
          className={styles.headerBackground}
        />
      </header>

      <div className={styles.main}>
        {/* Main Content */}
        <h2>hello world</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere totam
          ratione accusamus, asperiores soluta, inventore aut minima sunt,
          maiores vero fuga eius! Esse laboriosam beatae quod modi velit
          pariatur doloremque. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Qui ipsam quisquam laudantium doloribus in rerum
          officiis dolor fugiat sunt, sequi adipisci recusandae dolores
          molestiae. Alias sint fugit omnis blanditiis ab!
        </p>
      </div>
      <footer className={styles.footer}>{/* footer */}</footer>
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

export default ListenPage;
