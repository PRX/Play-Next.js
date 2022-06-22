/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import type { GetServerSideProps } from 'next';
import type { IEmbedData } from '@interfaces/data';
import type { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import parseEmbedParamsToConfig from '@lib/parse/config/parseEmbedParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import {
  embedInitialState,
  embedStateReducer
} from '@states/embed/Embed.reducer';
import { EmbedActionTypes } from '@states/embed/Embed.actions';
import generateEmbedHtml from '@lib/generate/html/generateEmbedHtml';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import Modal from '@components/Modal';
import PlayButton from '@components/Player/PlayButton';
import PlayerProgress from '@components/Player/PlayerProgress';
import MenuButton from '@components/MenuButton';
import IconButton from '@components/IconButton';
import CopyLinkButton from '@components/Player/CopyLinkButton';
import ShareFacebookButton from '@components/Player/ShareFacebookButton';
import ShareTwitterButton from '@components/Player/ShareTwitterButton';
import ShareEmailButton from '@components/Player/ShareEmailButton';
import PrxLogo from '@svg/prx-logo.svg';
import MoreHorizIcon from '@svg/icons/MoreHoriz.svg';
import CloseIcon from '@svg/icons/Close.svg';
import AddIcon from '@svg/icons/Add.svg';
import ShareIcon from '@svg/icons/Share.svg';
import FavoriteIcon from '@svg/icons/Favorite.svg';
import CodeIcon from '@svg/icons/Code.svg';
import styles from '@styles/Embed.module.scss';

// Define dynamic component imports.
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
  const [state, dispatch] = useReducer(embedStateReducer, embedInitialState);
  const { shareShown, followShown, supportShown } = state;
  const [showMenu, setShowMenu] = useState(false);
  const [playerLayout, setPlayerLayout] = useState<string>();
  const playerMainRef = useRef<HTMLDivElement>();
  const playerPanelRef = useRef<HTMLDivElement>();
  const playerControlsRef = useRef<HTMLDivElement>();
  const playerMenuRef = useRef<HTMLDivElement>();
  const layoutBreakpoints = useRef<{ name: string; minWidth: number }[]>([]);
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
  const embedHtml = generateEmbedHtml(config);
  const rootStyles = [
    ...(accentColor
      ? [
          `--accent-color:${accentColor[0].split(' ')[0]};`,
          ...(accentColor.length > 1
            ? [`--accent-gradient: ${accentColor.join(',')};`]
            : [])
        ]
      : [])
  ].join('');

  /**
   * Initialize our layout break points based on elements sizes.
   *
   * `compact` - default layout.
   * `compact-full` - small logo, controls and menu.
   * `extended-full` - large logo, controls and menu.
   */
  const initLayoutBreakpoints = useCallback(() => {
    const playerControlsRect =
      playerControlsRef.current.getBoundingClientRect();
    const playerMenuRect = playerMenuRef.current.getBoundingClientRect();
    const playerGap = parseInt(styles.playerGap, 10);
    const minPanelWidth =
      playerMenuRect.width + playerControlsRect.width + playerGap;
    const thumbnailOffset = !canShowCoverArt
      ? parseInt(styles['--player-thumbnail-size'], 10) + playerGap
      : 0;
    const breakpoints = [
      { name: 'compact', minWidth: 0 },
      { name: 'compact-full', minWidth: minPanelWidth },
      { name: 'extended-full', minWidth: thumbnailOffset + minPanelWidth }
    ].sort((a, b) => a.minWidth - b.minWidth);

    layoutBreakpoints.current = breakpoints;
  }, [canShowCoverArt]);

  /**
   * Update player layout by finding the last breakpoint with a min width the
   * player element fits into.
   */
  const updatePlayerLayout = useCallback(() => {
    const playerMainRect = playerMainRef.current.getBoundingClientRect();
    const bestFit = layoutBreakpoints.current.reduce(
      (a, c) => (playerMainRect.width > c.minWidth ? c : a),
      layoutBreakpoints.current[0]
    );

    setPlayerLayout(bestFit.name);
  }, []);

  const handleMoreButtonClick = () => {
    setShowMenu(!showMenu);
  };

  const handleFollowButtonClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_SHOW_FOLLOW_DIALOG });
  };

  const handleFollowCloseClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_HIDE_FOLLOW_DIALOG });
  };

  const handleShareButtonClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_SHOW_SHARE_DIALOG });
  };

  const handleShareCloseClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_HIDE_SHARE_DIALOG });
  };

  const handleSupportButtonClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_SHOW_SUPPORT_DIALOG });
  };

  const handleSupportCloseClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_HIDE_SUPPORT_DIALOG });
  };

  const handleResize = useCallback(() => {
    updatePlayerLayout();
  }, [updatePlayerLayout]);

  /**
   * Initialize layout breakpoints.
   */
  useEffect(() => {
    setTimeout(() => {
      initLayoutBreakpoints();
      updatePlayerLayout();
    }, 500);
  }, [initLayoutBreakpoints, canShowCoverArt, updatePlayerLayout]);

  /**
   * Setup/clean up window events.
   */
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <>
      <ThemeVars theme="EmbedTheme" cssProps={styles} />

      <Head>
        <title>PRX Play - Embeddable Player</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <style>{`:root {${rootStyles}}`}</style>
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

                <div
                  ref={playerMainRef}
                  className={styles.playerMain}
                  data-layout={playerLayout}
                >
                  {!canShowCoverArt && (
                    <div className={styles.thumbnail}>
                      <PlayerThumbnail
                      // sizes={`(min-width: 500px) ${styles['--player-thumbnail-size']}, ${styles['--player-thumbnail-size--mobile']}`}
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

                  <div ref={playerPanelRef} className={styles.panel}>
                    <div
                      ref={playerControlsRef}
                      className={clsx(styles.controls, menuShownClass)}
                    >
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

                    <div
                      ref={playerMenuRef}
                      className={clsx(styles.menu, menuShownClass)}
                    >
                      <IconButton
                        type="button"
                        className={clsx(styles.menuButton, styles.followButton)}
                        onClick={handleFollowButtonClick}
                      >
                        <AddIcon aria-label="Follow" />
                      </IconButton>

                      <IconButton
                        type="button"
                        className={clsx(styles.menuButton, styles.shareButton)}
                        onClick={handleShareButtonClick}
                      >
                        <ShareIcon aria-label="Share" />
                      </IconButton>

                      <IconButton
                        type="button"
                        className={clsx(
                          styles.menuButton,
                          styles.supportButton
                        )}
                        onClick={handleSupportButtonClick}
                      >
                        <FavoriteIcon aria-label="Support" />
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

              {shareShown && (
                <Modal onClose={handleShareCloseClick}>
                  <nav className={styles.modalMenu}>
                    <ShareFacebookButton />

                    <ShareTwitterButton />

                    <ShareEmailButton />

                    <CopyLinkButton />

                    <MenuButton
                      action="clipboard"
                      clipboardText={embedHtml}
                      label="Embed Code"
                    >
                      <CodeIcon />
                    </MenuButton>
                  </nav>
                </Modal>
              )}
            </Player>
          )}

          {followShown && (
            <Modal onClose={handleFollowCloseClick}>Follow Menu</Modal>
          )}

          {supportShown && (
            <Modal onClose={handleSupportCloseClick}>Support Menu</Modal>
          )}
        </div>
      </div>
    </>
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

export default EmbedPage;
