/**
 * @file [episodeId].tsx
 * Landing page to listen to individual episode.
 */

import type { GetServerSideProps } from 'next';
import type { IListenData } from '@interfaces/data';
import type { IPageProps } from '@interfaces/page';
import parseListenParamsToConfig from '@lib/parse/config/parseListenParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseListenData from '@lib/parse/data/parseListenData';
import styles from '@styles/Listen.module.scss';
import BackgroundImage from '@components/BackgroundImage/BackgroundImage';
import PrxImage from '@components/PrxImage';

export interface IListenPageProps extends IPageProps {
  data: IListenData;
}

const ListenPage = ({ data, config }: IListenPageProps) => {
  const { episodeGuid } = config;
  const { title, author, content, copyright, episodes, bgImageUrl } = data;
  const episode = episodes.find(({ guid }) => guid === episodeGuid);

  return (
    <div className={styles.root}>
      <div className={styles.background}>
        <BackgroundImage imageUrl={bgImageUrl} />
      </div>
      <div className={styles.main}>
        <div className={styles.content}>
          {!episode ? (
            <>
              <h1
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <PrxImage
                  src={bgImageUrl}
                  layout="raw"
                  width={48}
                  height={48}
                />
                {title}
              </h1>
              <p>
                <b>{author}</b>
              </p>
              {content}
              {copyright && (
                <p>
                  <em>{copyright}</em>
                </p>
              )}

              <h2>Episodes</h2>
              <ul
                style={{
                  display: 'grid',
                  gap: '0.75rem',
                  listStyle: 'none',
                  paddingInlineStart: '1rem'
                }}
              >
                {episodes.map(({ guid, title: episodeTitle, imageUrl }) => (
                  <li
                    key={guid}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '24px 1fr',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <PrxImage
                      src={imageUrl}
                      layout="raw"
                      width={24}
                      height={24}
                    />
                    {episodeTitle}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h1
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <PrxImage
                  src={episode.imageUrl}
                  layout="raw"
                  width={48}
                  height={48}
                />
                {episode.title}
              </h1>
              <p>
                <b>{author}</b>
              </p>
              {episode.content}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // 1. Convert query params into embed config.
  const config = parseListenParamsToConfig(query);
  // 2. If RSS feed URL is provided.
  const rssData = config.feedUrl && (await fetchRssFeed(config.feedUrl));
  // 3. Parse config and RSS data into embed data.
  const data = parseListenData(config, rssData);

  return {
    props: { config, data }
  };
};

export default ListenPage;
