/**
 *  @file [series].tsx
 * Landing page for a series, list of recent episodes
 *
 */

import type { GetServerSideProps } from 'next';
import type { IPageProps } from '@interfaces/page';
import type { ISeriesData } from '@interfaces/data';
import parseEmbedParamsToConfig from '@lib/parse/config/parseEmbedParamsToConfig';
import parseSeriesData from '@lib/parse/data/parseSeriesData';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import AppBar from '@components/Page/AppBar';
import styles from '@styles/Series.module.scss';
import BackgroundImage from '@components/BackgroundImage';

export interface ISeriesPageProps extends IPageProps {
  data: ISeriesData;
}

const SeriesPage = ({ data }: ISeriesPageProps) => {
  const { bgImageUrl, title, summary, episodes } = data;

  const formatEpisodePubDate = (pubDate: string) => {
    const date = new Date(pubDate);

    return `${date.getMonth().toString().padStart(2, '0')}/${date
      .getFullYear()
      .toString()
      .slice(2)}`;
  };

  return (
    <div className={styles.root}>
      <AppBar />
      <header className={styles.header}>
        <BackgroundImage
          imageUrl={bgImageUrl}
          className={styles.headerBackground}
        />
        <div className={styles.headerContent}>
          <h1>{title}</h1>
          <p>{summary}</p>
        </div>
      </header>

      <div className={styles.main}>
        <h2>Latest Episodes</h2>
        {episodes && (
          <div className={styles.episodes}>
            {episodes.map(
              ({
                guid,
                title: episodeTitle,
                teaser: episodeTeaser,
                pubDate
              }) => (
                <div className={styles.episode} key={guid}>
                  <div className={styles.episodeDate}>
                    {formatEpisodePubDate(pubDate)}
                  </div>
                  <div className={styles.episodeTitle}>{episodeTitle}</div>
                  <div className={styles.episodeTeaser}>{episodeTeaser}</div>
                </div>
              )
            )}
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
  const data = parseSeriesData(config, rssData);

  return {
    props: { config, data }
  };
};

export default SeriesPage;
