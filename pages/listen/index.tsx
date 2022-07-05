/**
 * @file [episodeId].tsx
 * Landing page to listen to individual episode.
 */

import type { GetServerSideProps } from 'next';
import type { IListenData } from '@interfaces/data';
import type { IPageProps } from '@interfaces/page';
import parseEmbedParamsToConfig from '@lib/parse/config/parseEmbedParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseListenData from '@lib/parse/data/parseListenData';
import AppBar from '@components/Page/AppBar/AppBar';
import styles from '@styles/Listen.module.scss';
import BackgroundImage from '@components/BackgroundImage/BackgroundImage';
import Player from '@components/Player';
import PlayButton from '@components/Player/PlayButton';
import PlayerThumbnail from '@components/Player/PlayerThumbnail';
import PlayerText from '@components/Player/PlayerText';

export interface IListenPageProps extends IPageProps {
  data: IListenData;
}

const ListenPage = ({ data }: IListenPageProps) => {
  const { bgImageUrl, episodeAudio, content, title } = data;
  return (
    <div className={styles.root}>
      <AppBar />

      <header className={styles.header}>
        <BackgroundImage
          imageUrl={bgImageUrl}
          className={styles.headerBackground}
        />
        <div className={styles.headerPlayer}>
          <Player audio={episodeAudio} imageUrl={bgImageUrl}>
            <PlayerThumbnail layout="fixed" width={100} height={100} />
            <PlayerText />
            <PlayButton />
          </Player>
        </div>
      </header>

      <div className={styles.main}>
        {/* Main Content */}
        <h2>{title}</h2>
        <p>{content}</p>
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
  const data = parseListenData(config, rssData);

  return {
    props: { config, data }
  };
};

export default ListenPage;
