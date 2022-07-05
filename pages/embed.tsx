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
import BackgroundImage from '@components/BackgroundImage/BackgroundImage';
import ThemeVars from '@components/ThemeVars';
import Modal from '@components/Modal';
import PlayButton from '@components/Player/PlayButton';
import PlayerProgress from '@components/Player/PlayerProgress';
import MenuButton from '@components/MenuButton';
import IconButton from '@components/IconButton';
import CopyLinkButton from '@components/Player/CopyLinkButton';
import ForwardButton from '@components/Player/ForwardButton';
import NextButton from '@components/Player/NextButton';
import Player from '@components/Player';
import PlayerText from '@components/Player/PlayerText';
import PreviousButton from '@components/Player/PreviousButton';
import ReplayButton from '@components/Player/ReplayButton';
import ShareFacebookButton from '@components/Player/ShareFacebookButton';
import ShareTwitterButton from '@components/Player/ShareTwitterButton';
import ShareEmailButton from '@components/Player/ShareEmailButton';
import MoreHorizIcon from '@svg/icons/MoreHoriz.svg';
import CloseIcon from '@svg/icons/Close.svg';
import AddIcon from '@svg/icons/Add.svg';
import ShareIcon from '@svg/icons/Share.svg';
import FavoriteIcon from '@svg/icons/Favorite.svg';
import CodeIcon from '@svg/icons/Code.svg';
import styles from '@styles/Embed.module.scss';

// Define dynamic component imports.
const PrxLogo = dynamic(() => import('@svg/PRX-Logo-Horizontal.svg'));
const PrxLogoColor = dynamic(
  () => import('@svg/PRX-Logo-Horizontal-Color.svg')
);
const CoverArt = dynamic(() => import('@components/Player/CoverArt'));
const PlayerThumbnail = dynamic(
  () => import('@components/Player/PlayerThumbnail')
);
const Playlist = dynamic(() => import('@components/Player/Playlist/Playlist'));

export interface IEmbedPageProps {
  config: IEmbedConfig;
  data: IEmbedData;
}

export interface IEmbedLayoutBreakPoint {
  name: string;
  minWidth: number;
  thumbnailSize: number;
}

const EmbedPage = ({ config, data }: IEmbedPageProps) => {
  const { showCoverArt, showPlaylist, accentColor, theme } = config;
  const { audio, playlist, bgImageUrl } = data;
  const { imageUrl } = audio || {};
  const [state, dispatch] = useReducer(embedStateReducer, embedInitialState);
  const { shareShown, followShown, supportShown } = state;
  const modalShown = shareShown || followShown || supportShown;
  const thumbnailSize = parseInt(styles['--player-thumbnail-size'], 10);
  const thumbnailSizeMobile = parseInt(
    styles['--player-thumbnail-size--mobile'],
    10
  );
  const [showMenu, setShowMenu] = useState(false);
  const [playerLayout, setPlayerLayout] = useState<IEmbedLayoutBreakPoint>();
  const playerMainRef = useRef<HTMLDivElement>();
  const playerPanelRef = useRef<HTMLDivElement>();
  const playerControlsRef = useRef<HTMLDivElement>();
  const playerMenuRef = useRef<HTMLDivElement>();
  const layoutBreakpoints = useRef<IEmbedLayoutBreakPoint[]>([
    { name: 'init', minWidth: 0, thumbnailSize: thumbnailSizeMobile }
  ]);
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
    if (!playerControlsRef.current) return;

    // Protect against React double render.
    if (layoutBreakpoints.current.length > 1) return;

    const playerControlsRect =
      playerControlsRef.current.getBoundingClientRect();
    const playerMenuRect = playerMenuRef.current.getBoundingClientRect();
    const playerGap = parseInt(styles.playerGap, 10);
    const minPanelWidth =
      playerMenuRect.width + playerControlsRect.width + playerGap;
    const thumbnailOffset = !canShowCoverArt ? thumbnailSize + playerGap : 0;
    const breakpoints: IEmbedLayoutBreakPoint[] = [
      { name: 'compact', minWidth: 0, thumbnailSize: thumbnailSizeMobile },
      {
        name: 'compact-full',
        minWidth: minPanelWidth,
        thumbnailSize: thumbnailSizeMobile
      },
      {
        name: 'extended-full',
        minWidth: thumbnailOffset + minPanelWidth,
        thumbnailSize
      }
    ].sort((a, b) => a.minWidth - b.minWidth);

    layoutBreakpoints.current = breakpoints;
  }, [canShowCoverArt, thumbnailSize, thumbnailSizeMobile]);

  /**
   * Update player layout by finding the last breakpoint with a min width the
   * player element fits into.
   */
  const updatePlayerLayout = useCallback(() => {
    if (!playerMainRef.current) return;

    const playerMainRect = playerMainRef.current.getBoundingClientRect();
    const bestFit = layoutBreakpoints.current.reduce(
      (a, c) => (playerMainRect.width > c.minWidth ? c : a),
      layoutBreakpoints.current[0]
    );
    const onAnimationComplete = () => {
      // Get rid of temp inline style that prevents content flash.
      playerMenuRef.current.setAttribute('style', '');

      playerMenuRef.current.removeEventListener(
        'animationend',
        onAnimationComplete
      );
    };

    playerMenuRef.current.addEventListener('animationend', onAnimationComplete);

    setPlayerLayout(bestFit);
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
      <div className={styles.container} data-theme={theme}>
        <div className={mainClasses}>
          {audio && (
            <Player
              audio={playlist || audio}
              startIndex={currentTrackIndex}
              imageUrl={bgImageUrl}
            >
              {canShowCoverArt && (
                <div
                  className={styles.coverArt}
                  {...(modalShown && {
                    inert: 'inert'
                  })}
                >
                  <CoverArt />
                </div>
              )}

              <div
                className={styles.playerContainer}
                {...(modalShown && {
                  inert: 'inert'
                })}
              >
                <BackgroundImage
                  imageUrl={bgImageUrl}
                  className={styles.background}
                />

                <div
                  ref={playerMainRef}
                  className={styles.playerMain}
                  data-layout={playerLayout?.name}
                >
                  {!canShowCoverArt && playerLayout && (
                    <div className={styles.thumbnail}>
                      <PlayerThumbnail
                        layout="raw"
                        width={playerLayout?.thumbnailSize}
                        height={playerLayout?.thumbnailSize}
                      />
                    </div>
                  )}

                  <div className={styles.text}>
                    <PlayerText />
                  </div>

                  <div className={styles.logo}>
                    {theme === 'light' ? <PrxLogoColor /> : <PrxLogo />}
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
                      {...(showMenu &&
                        playerLayout?.name === 'compact' && {
                          inert: 'inert'
                        })}
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
                      {...(!showMenu &&
                        playerLayout?.name === 'compact' && {
                          inert: 'inert'
                        })}
                      style={{
                        // Initialize hidden to prevent content flash.
                        visibility: 'hidden'
                      }}
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
                <div
                  className={styles.playlist}
                  {...(modalShown && {
                    inert: 'inert'
                  })}
                >
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
