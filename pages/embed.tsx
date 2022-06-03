/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { IEmbedData } from '@interfaces/data';
import { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';
import parseEmbedParams from '@lib/parse/config/parseEmbedParams';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import PlayButton from '@components/Player/PlayButton';
import ThemeVars from '@components/ThemeVars';
import PlayerProgress from '@components/Player/PlayerProgress';
import styles from '@styles/Embed.module.scss';
import PrxLogo from '@svg/prx-logo.svg';
import MoreHorizIcon from '@svg/icons/MoreHoriz.svg';
import CloseIcon from '@svg/icons/Close.svg';
import PrxImage from '@components/PrxImage';

// Define dynamic component imports.
const IconButton = dynamic(() => import('@components/IconButton'));
const PlayerText = dynamic(() => import('@components/Player/PlayerText'));
const ReplayButton = dynamic(() => import('@components/Player/ReplayButton'));
const ForwardButton = dynamic(() => import('@components/Player/ForwardButton'));
const Player = dynamic(() => import('@components/Player'));
const CoverArt = dynamic(() => import('@components/Player/CoverArt'));
const PlayerThumbnail = dynamic(
  () => import('@components/Player/PlayerThumbnail')
);
const Playlist = dynamic(() => import('@components/Player/Playlist/Playlist'));
const PreviousButton = dynamic(
  () => import('@components/Player/PreviousButton')
);
const NextButton = dynamic(() => import('@components/Player/NextButton'));

export interface IEmbedPageProps {
  config: IEmbedConfig;
  data: IEmbedData;
}

const EmbedPage = ({ config, data }: IEmbedPageProps) => {
  const { showCoverArt, showPlaylist, accentColor } = config;
  const { audio, playlist, bgImageUrl } = data;
  const { imageUrl } = audio || {};
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
      <ThemeVars theme="EmbedTheme" cssProps={styles} />

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
              {canShowCoverArt && (
                <div className={styles.coverArt}>
                  <CoverArt />
                </div>
              )}

              <div className={styles.playerContainer}>
                <div className={styles.background}>
                  <PrxImage
                    src={bgImageUrl}
                    layout="fill"
                    objectFit="cover"
                    aria-hidden
                    priority
                  />
                </div>

                <div className={styles.playerMain}>
                  {!canShowCoverArt && (
                    <div className={styles.thumbnail}>
                      <PlayerThumbnail
                        sizes={`(min-width: 500px) ${styles['--playerThumbnail-size']}, ${styles['--playerThumbnail-size--mobile']}`}
                      />
                    </div>
                  )}

                  <div className={styles.text}>
                    <PlayerText />
                  </div>

                  <div className={styles.logo}>
                    {/* TODO: Get PRX text to line up with title baseline. */}
                    <PrxLogo className={styles.logoPrx} />
                  </div>

                  <div className={styles.panel}>
                    <div className={clsx(styles.controls, menuShownClass)}>
                      {canShowPlaylist && (
                        <PreviousButton
                          className={clsx(styles.button, styles.previousButton)}
                          disabled={currentTrackIndex === 1}
                        />
                      )}

                      <ReplayButton
                        className={clsx(styles.button, styles.replayButton)}
                      />

                      <PlayButton
                        className={clsx(styles.button, styles.playButton)}
                      />

                      <ForwardButton
                        className={clsx(styles.button, styles.replayButton)}
                      />

                      {canShowPlaylist && (
                        <NextButton
                          className={clsx(styles.button, styles.nextButton)}
                          disabled={currentTrackIndex === playlist.length - 1}
                        />
                      )}
                    </div>

                    <div className={clsx(styles.menu, menuShownClass)}>
                      {/* TODO: Replace content with dialog menu buttons. */}
                      Menu
                    </div>

                    <div className={styles.menuToggle}>
                      <IconButton
                        type="button"
                        className={clsx(styles.iconButton, styles.moreButton)}
                        onClick={handleMoreButtonClick}
                      >
                        {!showMenu ? (
                          <MoreHorizIcon aria-label="Show menu" />
                        ) : (
                          <CloseIcon aria-label="Close menu" />
                        )}
                      </IconButton>
                    </div>
                  </div>

                  <div className={styles.progress}>
                    <PlayerProgress />
                  </div>
                </div>
              </div>

              {canShowPlaylist && (
                <div className={styles.playlist}>
                  <Playlist style={{ height: '100%' }} />
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
