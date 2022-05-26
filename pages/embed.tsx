/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import { useState } from 'react';
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
import CoverArt from '@components/Player/CoverArt';
import PrxLogo from '@svg/prx-logo.svg';
import MoreHorizIcon from '@svg/icons/MoreHoriz.svg';
import CloseIcon from '@svg/icons/Close.svg';

export interface IEmbedPageProps {
  config: IEmbedConfig;
  data: IEmbedData;
}

const EmbedPage = ({ config, data }: IEmbedPageProps) => {
  const { showCoverArt, showPlaylist, accentColor } = config;
  const { audio, playlist, bgImageUrl } = data;
  const { guid, imageUrl, title, subtitle } = audio || {};
  const [showMenu, setShowMenu] = useState(false);
  const menuShownClass = clsx({ [styles.menuShown]: showMenu });
  const coverArtImage = imageUrl || bgImageUrl;
  const canShowCoverArt = showCoverArt && coverArtImage;
  const canShowPlaylist = !!(showPlaylist && playlist?.length);
  const currentTrackIndex = playlist?.findIndex(
    (track) => track.guid === audio.guid
  );
  const mainClasses = clsx(styles.main, {
    [styles.withCoverArt]: canShowCoverArt,
    [styles.withPlaylist]: canShowPlaylist
  });

  const handleMoreButtonClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <Head>
        <title>PRX Play - Embeddable Player</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <style>{`
          :root {
            ${accentColor && `--accent-color: #${accentColor};`}
          }
        `}</style>
      </Head>

      <div className={styles.container}>
        <div className={mainClasses}>
          {audio && (
            <Player
              audio={playlist || audio}
              startIndex={currentTrackIndex}
              imageUrl={bgImageUrl}
            >
              {showCoverArt && <CoverArt />}

              <div className={styles.playerContainer}>
                <div className={styles.background}>
                  <PrxImage
                    src={bgImageUrl}
                    layout="fill"
                    objectFit="cover"
                    aria-hidden
                  />
                </div>

                <div className={styles.playerMain}>
                  {!showCoverArt && (
                    <div className={styles.thumbnail}>
                      <PrxImage
                        src={imageUrl}
                        alt={`Thumbnail for "${title}".`}
                        layout="intrinsic"
                        width={135}
                        height={135}
                      />
                    </div>
                  )}

                  <div className={styles.text}>
                    <h2 className={styles.title}>
                      {title.match(/\s*\S+/g).map((word, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <span key={`${word}:${i}`}>{word}</span>
                      ))}
                    </h2>
                    <p className={styles.subtitle}>{subtitle}</p>
                  </div>

                  <div className={styles.logo}>
                    {/* TODO: Get PRX text to line up witrh title baseline. */}
                    <PrxLogo className={styles.logoPrx} />
                  </div>

                  <div className={styles.panel}>
                    <div className={clsx(styles.controls, menuShownClass)}>
                      {/* TODO: Move play button into a PlayerControls component. */}
                      <PlayButton
                        className={clsx(styles.button, styles.playButton)}
                      />
                    </div>

                    <div className={clsx(styles.menu, menuShownClass)}>
                      {/* TODO: Replace content with dialog menu buttons. */}
                      Menu
                    </div>

                    <div className={styles.menuToggle}>
                      <button
                        type="button"
                        className={clsx(styles.iconButton, styles.moreButton)}
                        onClick={handleMoreButtonClick}
                      >
                        {showMenu ? <CloseIcon /> : <MoreHorizIcon />}
                      </button>
                    </div>
                  </div>

                  <div className={styles.progressBar} />
                </div>
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
                        key={trackGuid}
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
