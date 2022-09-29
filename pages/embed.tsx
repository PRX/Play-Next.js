/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import type { GetServerSideProps } from 'next';
import type { IRss } from '@interfaces/data';
import type { IPageError } from '@interfaces/error';
import type { IEmbedPageProps, IPageProps } from '@interfaces/page';
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Error from 'next/error';
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
import PlayButton from '@components/Player/PlayButton';
import PlayerProgress from '@components/Player/PlayerProgress';
import IconButton from '@components/IconButton';
import ForwardButton from '@components/Player/ForwardButton';
import NextButton from '@components/Player/NextButton';
import Player from '@components/Player';
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

const EmbedPage = ({ config, data, error }: IEmbedPageProps) => {
  const { showCoverArt, showPlaylist, accentColor, theme } = config;
  const {
    audio,
    playlist,
    bgImageUrl,
    followUrls,
    supportUrls,
    paymentPointer
  } = data;
  const { imageUrl } = audio || {};
  const [state, dispatch] = useReducer(embedStateReducer, embedInitialState);
  const { shareShown, followShown, supportShown, webMonetizationShown } = state;
  const modalShown =
    shareShown || followShown || supportShown || webMonetizationShown;
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

  const handleWebMonetizationButtonClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_SHOW_WEB_MONETIZATION_DIALOG });
  };

  const handleWebMonetizationCloseClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_HIDE_WEB_MONETIZATION_DIALOG });
  };

  const handleResize = useCallback(() => {
    updatePlayerLayout();
  }, [updatePlayerLayout]);

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

  if (error) {
    return <Error statusCode={error.statusCode} title={error.message} />;
  }

  return (
    <>
      <ThemeVars theme="EmbedTheme" cssProps={styles} />

      <Head>
        <title>PRX Play - Embeddable Player</title>
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

                      <PlayerShareMenu
                        className={clsx(styles.menuButton, styles.shareButton)}
                        onOpen={handleShareButtonClick}
                        onClose={handleShareCloseClick}
                        embedHtml={embedHtml}
                        isOpen={shareShown}
                        portalId="embed-modals"
                      />

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

              {modalShown && (
                <div
                  className={styles.modals}
                  id="embed-modals"
                  {...(!modalShown && {
                    inert: 'inert'
                  })}
                />
              )}
            </Player>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<IPageProps> = async ({
  query,
  res
}) => {
  // 1. Convert query params into embed config.
  const config = parseEmbedParamsToConfig(query);

  // 2. If RSS feed URL is provided...
  let rssData: IRss;
  let error: IPageError;
  try {
    // ...try to fetch the feed...
    rssData = config.feedUrl && (await fetchRssFeed(config.feedUrl));
  } catch (e) {
    switch (e.name) {
      case 'RssProxyError':
        // ...and handle any RssProxyError as a 400.
        res.statusCode = 400;
        error = {
          statusCode: 400,
          message: 'Bad Feed URL Provided'
        };
        break;
      default:
        // ...otherwise throw the caught error so we can get 5XX alarms for anything else.
        throw e;
    }
  }

  // 3. Parse config and RSS data into embed data.
  const data = parseEmbedData(config, rssData);

  return {
    props: { config, data, ...(error && { error }) }
  };
};

export default EmbedPage;
