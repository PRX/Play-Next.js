/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import clsx from 'clsx';
import { IEmbedData } from '@interfaces/data';
import { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';
import parseEmbedParams from '@lib/parse/config/parseEmbedParams';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import Player from '@components/Player';
import PlayButton from '@components/Player/PlayButton';
import styles from '@styles/Embed.module.scss';
import PrxImage from '@components/PrxImage';

export interface IEmbedPageProps {
  config: IEmbedConfig;
  data: IEmbedData;
}

const EmbedPage = ({ config, data }: IEmbedPageProps) => {
  const { showCoverArt, showPlaylist } = config;
  const { audio, playlist, bgImageUrl } = data;
  const { guid, imageUrl, title } = audio || {};
  const coverArtImage = imageUrl || bgImageUrl;
  const canShowCoverArt = showCoverArt && coverArtImage;
  const canShowPlaylist = !!(showPlaylist && playlist?.length);
  const mainClasses = clsx(styles.main, {
    [styles.withCoverArt]: canShowCoverArt,
    [styles.withPlaylist]: canShowPlaylist
  });

  return (
    <>
      <Head>
        <title>PRX Play - Embeddable Player</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
      </Head>

      <div className={styles.container}>
        <div className={mainClasses}>
          {audio && (
            <Player data={audio}>
              {showCoverArt && (
                <div className={styles.coverArt}>
                  {/* TODO: Replace with CoverArt component. */}
                  <PrxImage
                    src={imageUrl}
                    alt={`Cover art for "${title}".`}
                    layout="fill"
                    priority
                  />
                </div>
              )}
              <div className={styles.player}>
                <PlayButton />
              </div>
              {canShowPlaylist && (
                <div className={styles.playlist}>
                  {/* TODO: Replace with Playlist component. */}
                  {playlist.map((track) => {
                    const {
                      title: trackTitle,
                      guid: trackGuid,
                      imageUrl: trackThumbUrl
                    } = track;
                    return (
                      <button
                        type="button"
                        className={clsx(styles.track, {
                          [styles.isCurrentTrack]: trackGuid === guid
                        })}
                        key={guid}
                      >
                        {trackThumbUrl || imageUrl ? (
                          <PrxImage
                            src={trackThumbUrl || imageUrl}
                            alt={`Thumbnail for "${trackTitle}".`}
                            layout="intrinsic"
                            width={styles.thumbnailWidth}
                            height={styles.thumbnailWidth}
                          />
                        ) : (
                          <span />
                        )}
                        <span className={styles.trackTitle}>{trackTitle}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </Player>
          )}
        </div>
      </div>

      {/* TODO: Add Modals here. */}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // 1. Convert query params into embed config.
  const config = parseEmbedParams(query);
  // 2. If RSS feed URL is provided.
  const rssData = config.feedUrl && (await fetchRssFeed(config.feedUrl));
  // 3. Parse config and RSS data into embed data.
  const data = parseEmbedData(config, rssData);

  return {
    props: { config, data }
  };
};

export default EmbedPage;
