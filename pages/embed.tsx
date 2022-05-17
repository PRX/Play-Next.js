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
import React, { useState } from 'react';
import PrxImage from '@components/PrxImage';

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
  const mainClasses = clsx(styles.main, {
    [styles.withCoverArt]: canShowCoverArt,
    [styles.withPlaylist]: showPlaylist
  });
  const [currentTrack, setCurrentTrack] = useState(audio);

  const handleTrackClick = (track) => () => {
    setCurrentTrack(track);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={mainClasses}>
          {audio && (
            <Player data={currentTrack}>
              {canShowCoverArt && (
                <div className={styles.cover}>
                  {/* TODO: Replace with CoverArt component. */}
                  <PrxImage
                    src={coverArtImage}
                    alt={`Cover art for "${title}".`}
                    layout="fill"
                    priority
                  />
                </div>
              )}
              <div className={styles.player}>
                <div className={styles.playerBackground}>
                  <PrxImage
                    src={bgImageUrl}
                    layout="fill"
                    objectFit="cover"
                    aria-hidden
                  />
                </div>
                <div className={styles.playerControls}>
                  <PlayButton />
                </div>
              </div>

              {showPlaylist && (
                <div className={styles.playlist}>
                  {/* TODO: Replace with Playlist component. */}
                  {playlist.map((track) => {
                    const {
                      title: trackTitle,
                      guid,
                      imageUrl: trackThumbUrl
                    } = track;
                    return (
                      <button
                        type="button"
                        className={clsx(styles.track, {
                          [styles.isCurrentTrack]: currentTrack.guid === guid
                        })}
                        key={guid}
                        onClick={handleTrackClick(track)}
                      >
                        <PrxImage
                          src={trackThumbUrl || imageUrl}
                          alt={`Thumbnail for "${trackTitle}".`}
                          layout="intrinsic"
                          width={styles.thumbnailWidth}
                          height={styles.thumbnailWidth}
                        />
                        {trackTitle}
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
