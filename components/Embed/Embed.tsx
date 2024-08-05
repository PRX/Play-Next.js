/**
 * @file Embed.tsx
 * Exports the Embed component.
 */

import type { IEmbedProps } from '@interfaces/embed';
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import {
  embedInitialState,
  embedStateReducer
} from '@states/embed/Embed.reducer';
import { EmbedActionTypes } from '@states/embed/Embed.actions';
import generateEmbedHtml from '@lib/generate/html/generateEmbedHtml';
import BackgroundImage from '@components/BackgroundImage/BackgroundImage';
import ThemeVars from '@components/ThemeVars';
import PlayButton from '@components/Player/PlayButton';
import PlayerProgress from '@components/Player/PlayerProgress';
import IconButton from '@components/IconButton';
import ForwardButton from '@components/Player/ForwardButton';
import NextButton from '@components/Player/NextButton';
import Player from '@components/Player';
import ClosedCaptionsDialog from '@components/Player/ClosedCaptionsDialog';
import PlayerText from '@components/Player/PlayerText';
import PlayerThumbnail from '@components/Player/PlayerThumbnail';
import PreviousButton from '@components/Player/PreviousButton';
import ReplayButton from '@components/Player/ReplayButton';
import PlayerShareMenu from '@components/Player/PlayerShareMenu';
import FollowMenu from '@components/Player/FollowMenu';
import SupportMenu from '@components/Player/SupportMenu';
import WebMonetized from '@components/Player/WebMonetized';
import MoreHorizIcon from '@svg/icons/MoreHoriz.svg';
import CloseIcon from '@svg/icons/Close.svg';
import styles from '@styles/Embed.module.scss';
import ClosedCaptions from '@components/Player/ClosedCaptions';
import ClosedCaptionsFeed from '@components/Player/ClosedCaptionsFeed';
import EmbedSettingsMenu from './EmbedSettingsMenu';

// Define dynamic component imports.
const PrxLogo = dynamic(() => import('@svg/logos/PRX-Logo-Horizontal.svg'));
const PrxLogoColor = dynamic(
  () => import('@svg/logos/PRX-Logo-Horizontal-Color.svg')
);
const CoverArt = dynamic(() => import('@components/Player/CoverArt'));

const Playlist = dynamic(() => import('@components/Player/Playlist/Playlist'));

export interface IEmbedLayoutBreakPoint {
  name: string;
  minWidth: number;
  thumbnailSize: number;
}

const Embed = ({ config, data }: IEmbedProps) => {
  const { showCoverArt, showPlaylist, accentColor, theme } = config;
  const {
    mode,
    audio,
    playlist,
    bgImageUrl,
    followUrls,
    supportUrls,
    paymentPointer
  } = data;
  const isPreview = mode === 'preview';
  const { imageUrl } = audio || {};
  const [state, dispatch] = useReducer(embedStateReducer, embedInitialState);
  const {
    closedCaptionsShown,
    shareShown,
    followShown,
    supportShown,
    webMonetizationShown,
    settingsShown
  } = state;
  const modalShown =
    shareShown ||
    followShown ||
    supportShown ||
    webMonetizationShown ||
    settingsShown;
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
  const currentTrackIndex = !playlist
    ? 0
    : Math.max(
        0,
        playlist.findIndex((track) => track.guid === audio.guid)
      );
  const currentTrack = playlist?.[currentTrackIndex] || audio;
  const showShareMenu = !!currentTrack?.link || !isPreview;
  const showClosedCaptionsButton = !!currentTrack?.transcripts?.length;
  const showClosedCaptionFeed = closedCaptionsShown && canShowCoverArt;
  const showClosedCaptionDialog = !showClosedCaptionFeed && closedCaptionsShown;
  const mainClasses = clsx(styles.main, {
    [styles.withCoverArt]: canShowCoverArt,
    [styles.withPlaylist]: canShowPlaylist
  });
  const embedHtml = !isPreview && generateEmbedHtml(config);
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

  const handleClosedCaptionButtonClick = () => {
    dispatch({
      type: EmbedActionTypes.EMBED_TOGGLE_CLOSED_CAPTIONS_DIALOG_SHOWN
    });
  };

  const handleClosedCaptionCloseClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_HIDE_CLOSED_CAPTIONS_DIALOG });
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

  const handleWebMonetizationButtonClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_SHOW_WEB_MONETIZATION_DIALOG });
  };

  const handleWebMonetizationCloseClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_HIDE_WEB_MONETIZATION_DIALOG });
  };

  const handleSettingsButtonClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_SHOW_SETTINGS_DIALOG });
  };

  const handleSettingsCloseClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_HIDE_SETTINGS_DIALOG });
  };

  const handleResize = useCallback(() => {
    initLayoutBreakpoints();
    updatePlayerLayout();
  }, [initLayoutBreakpoints, updatePlayerLayout]);

  /**
   * Initialize layout breakpoints.
   */
  useEffect(() => {
    initLayoutBreakpoints();
    updatePlayerLayout();
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
        <style>{`:root {${rootStyles}}`}</style>
      </Head>
      <div className={styles.container} data-theme={theme}>
        <div className={mainClasses}>
          {!audio && (
            <div className={styles.messageContainer}>
              <BackgroundImage
                imageUrl={bgImageUrl}
                className={styles.background}
              />
              <p>Episode Not Available</p>
            </div>
          )}
          {audio && (
            <Player
              audio={playlist || audio}
              startIndex={currentTrackIndex}
              imageUrl={bgImageUrl}
            >
              {canShowCoverArt && (
                <div
                  className={styles.coverArt}
                  {...(modalShown && { inert: '' })}
                >
                  <CoverArt />

                  {showClosedCaptionFeed && (
                    <div
                      className={clsx(styles.modals, styles.closedCaptionsFeed)}
                      id="embed-closed-caption-modal"
                      {...(!closedCaptionsShown && { inert: '' })}
                    />
                  )}
                </div>
              )}

              <div
                className={styles.playerContainer}
                {...(modalShown && { inert: '' })}
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
                        width={playerLayout?.thumbnailSize}
                        height={playerLayout?.thumbnailSize}
                      />
                    </div>
                  )}

                  <div className={styles.text}>
                    <PlayerText />
                  </div>

                  <div className={styles.logo}>
                    <a
                      href="https://prx.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.logoLink}
                    >
                      {theme === 'light' ? <PrxLogoColor /> : <PrxLogo />}
                    </a>
                  </div>

                  <div className={styles.menuToggle}>
                    <IconButton
                      type="button"
                      className={clsx(styles.iconButton, styles.moreButton)}
                      onClick={handleMoreButtonClick}
                      title={!showMenu ? 'Show menu' : 'Close Menu'}
                    >
                      {!showMenu ? <MoreHorizIcon /> : <CloseIcon />}
                    </IconButton>
                  </div>

                  <div ref={playerPanelRef} className={styles.panel}>
                    <div
                      ref={playerControlsRef}
                      className={clsx(styles.controls, menuShownClass)}
                      {...(showMenu &&
                        playerLayout?.name === 'compact' && { inert: '' })}
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
                        playerLayout?.name === 'compact' && { inert: '' })}
                      style={{
                        // Initialize hidden in compact layout to prevent content flash.
                        ...(playerLayout?.name === 'compact' && {
                          visibility: 'hidden'
                        })
                      }}
                    >
                      {showClosedCaptionsButton && (
                        <ClosedCaptionsDialog
                          className={clsx(
                            styles.menuButton,
                            styles.closedCaptionsButton,
                            {
                              [styles.closedCaptionsEnabled]:
                                closedCaptionsShown
                            }
                          )}
                          onOpen={handleClosedCaptionButtonClick}
                          onClose={handleClosedCaptionCloseClick}
                          isOpen={closedCaptionsShown}
                          portalId="embed-closed-caption-modal"
                        >
                          {showClosedCaptionFeed ? (
                            <ClosedCaptionsFeed speakerColors={accentColor} />
                          ) : (
                            <ClosedCaptions speakerColors={accentColor} />
                          )}
                        </ClosedCaptionsDialog>
                      )}

                      <FollowMenu
                        className={clsx(
                          styles.menuButton,
                          styles.followRssButton
                        )}
                        onOpen={handleFollowButtonClick}
                        onClose={handleFollowCloseClick}
                        isOpen={followShown}
                        portalId="embed-modals"
                        followUrls={followUrls}
                      />

                      {showShareMenu && (
                        <PlayerShareMenu
                          className={clsx(
                            styles.menuButton,
                            styles.shareButton
                          )}
                          onOpen={handleShareButtonClick}
                          onClose={handleShareCloseClick}
                          embedHtml={embedHtml}
                          downloadable={!isPreview}
                          isOpen={shareShown}
                          portalId="embed-modals"
                        />
                      )}

                      <SupportMenu
                        className={clsx(
                          styles.menuButton,
                          styles.supportButton
                        )}
                        onOpen={handleSupportButtonClick}
                        onClose={handleSupportCloseClick}
                        isOpen={supportShown}
                        portalId="embed-modals"
                        supportUrls={supportUrls}
                      />
                    </div>
                  </div>

                  <div className={styles.progress}>
                    <PlayerProgress />
                    <WebMonetized
                      className={styles.monetized}
                      onOpen={handleWebMonetizationButtonClick}
                      onClose={handleWebMonetizationCloseClick}
                      isOpen={webMonetizationShown}
                      portalId="embed-modals"
                      paymentPointer={paymentPointer}
                    />
                    <EmbedSettingsMenu
                      portalId="embed-modals"
                      isOpen={settingsShown}
                      onOpen={handleSettingsButtonClick}
                      onClose={handleSettingsCloseClick}
                    />
                  </div>
                </div>

                {showClosedCaptionDialog && (
                  <div
                    className={styles.modals}
                    id="embed-closed-caption-modal"
                    {...(!closedCaptionsShown && { inert: '' })}
                  />
                )}
              </div>

              {canShowPlaylist && (
                <div
                  className={styles.playlist}
                  {...(modalShown && { inert: '' })}
                >
                  <Playlist style={{ height: '100%' }} />
                </div>
              )}

              {modalShown && (
                <div
                  className={styles.modals}
                  id="embed-modals"
                  {...(!modalShown && { inert: '' })}
                />
              )}
            </Player>
          )}
        </div>
      </div>
    </>
  );
};

export default Embed;
