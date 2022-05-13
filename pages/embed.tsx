/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import { GetServerSideProps } from 'next';
import clsx from 'clsx';
import { IEmbedData } from '@interfaces/data';
import { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';
import parseEmbedParams from '@lib/parse/config/parseEmbedParams';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import Player from '@components/Player';
import PlayButton from '@components/Player/PlayButton';
import styles from '@styles/Embed.module.scss';

export interface IEmbedPageProps {
  config: IEmbedConfig;
  data: IEmbedData;
}

const EmbedPage = ({ config, data }: IEmbedPageProps) => {
  const { showCoverArt, showPlaylist } = config;
  const { audio, bgImageUrl, playlist } = data;
  const { imageUrl, title } = audio || {};
  const coverArtImage = imageUrl || bgImageUrl;
  const canShowCoverArt = showCoverArt && coverArtImage;
  const containerClasses = clsx(styles.main, {
    [styles.withCoverArt]: canShowCoverArt,
    [styles.withPlaylist]: showPlaylist
  });

  return (
    <>
      <div className={styles.container}>
        <div className={containerClasses}>
          {audio && (
            <Player data={audio}>
              {canShowCoverArt && (
                <div className={styles.cover}>
                  {/* TODO: Replace with CoverArt component. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverArtImage} alt={`Cover art for "${title}"`} />
                </div>
              )}
              <div className={styles.player}>
                <PlayButton />
              </div>
              {showPlaylist && (
                <div className={styles.playlist}>
                  {/* TODO: Replace with Playlist component. */}
                  {playlist.map(
                    ({ title: trackTitle, guid, imageUrl: trackThumbUrl }) => (
                      <div
                        className={clsx(styles.track, {
                          [styles.isCurrentTrack]: audio.guid === guid
                        })}
                        key={guid}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={trackThumbUrl}
                          alt={`Thumbnail for "${trackTitle}"`}
                        />
                        {trackTitle}
                      </div>
                    )
                  )}
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
