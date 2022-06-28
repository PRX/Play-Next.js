/**
 *  @file [series].tsx
 * Landing page for a series, list of recent episodes
 *
 */

import type { GetServerSideProps } from 'next';
import type { IPageProps } from '@interfaces/page';
import parseEmbedParamsToConfig from '@lib/parse/config/parseEmbedParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import AppBar from '@components/Page/AppBar';
import styles from '@styles/Series.module.scss';
import BackgroundImage from '@components/BackgroundImage';

// REMOVE WHEN Series page data interface is done.
import { ISeriesData } from '@interfaces/data';

export interface ISeriesPageProps extends IPageProps {
  data: ISeriesData;
}

const SeriesPage = ({ data }: ISeriesPageProps) => {
  const { bgImageUrl, rssTitle, playlist } = data;
  return (
    <div className={styles.root}>
      <AppBar />
      <header className={styles.header}>
        <BackgroundImage
          imageUrl={bgImageUrl}
          className={styles.headerBackground}
        />
        <div className={styles.headerContent}>
          <h1>{rssTitle}</h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex
            voluptatibus quod esse tenetur quaerat voluptas adipisci voluptatem
            odit distinctio. Consectetur corrupti necessitatibus obcaecati fugit
            distinctio repudiandae pariatur ab libero labore. Lorem, ipsum dolor
            sit amet consectetur adipisicing elit. Rerum, inventore omnis
            officiis fuga, ipsum sequi laborum saepe at, in velit incidunt
            expedita eligendi quo aut? Velit temporibus neque illo natus!
          </p>
        </div>
      </header>

      <div className={styles.main}>
        <h2>Latest Episodes</h2>
        {playlist && (
          <div className={styles.episodes}>
            {playlist.map(({ title, guid }) => (
              <div className={styles.episode} key={guid}>
                <div className={styles.episodeDate}>07/22</div>
                <div className={styles.episodeTitle}>{title}</div>
                <div className={styles.episodeTeaser}>{rssTitle}</div>
              </div>
            ))}
          </div>
        )}
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
