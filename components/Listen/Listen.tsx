/**
 * @file Listen.tsx
 * Component for listen UX. SHould be able to used on the page, and in builder.
 */

import type React from 'react';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import BackgroundImage from '@components/BackgroundImage';
import HtmlContent from '@components/HtmlContent';
import Marquee from '@components/Marquee';
import FollowMenu from '@components/Player/FollowMenu';
import ShareMenu from '@components/ShareMenu';
import SupportMenu from '@components/Player/SupportMenu';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import { IListenPageProps } from '@interfaces/page';
import {
  listenInitialState,
  listenStateReducer
} from '@states/listen/Listen.reducer';
import { ListenActionTypes } from '@states/listen/Listen.actions';
import PrxDtLogo from '@svg/PRX-DT-Logo.svg';
import EpisodeList from './EpisodeList';
import styles from './Listen.module.scss';
import Episode from './Episode';
import FooterPlayer from './FooterPlayer';

const Listen = ({ config, data }: IListenPageProps) => {
  const router = useRouter();
  const { episodeGuid: configEpisodeGuid, accentColor, theme } = config;
  const [state, dispatch] = useReducer(listenStateReducer, {
    ...listenInitialState,
    view: configEpisodeGuid ? 'episode-init' : 'podcast-init',
    ...(configEpisodeGuid && { episodeGuid: configEpisodeGuid })
  });
  const {
    view,
    episodeGuid,
    podcastFollowShown,
    podcastShareShown,
    podcastSupportShown
  } = state;
  const {
    title,
    author,
    content,
    copyright,
    episodes,
    bgImageUrl,
    link,
    followUrls,
    supportUrls
  } = data;
  const { state: playerState } = useContext(PlayerContext);
  const { currentTrackIndex } = playerState;
  const playerShown = currentTrackIndex !== null && currentTrackIndex >= 0;
  const episode = useMemo(
    () => episodes && episodes.find(({ guid }) => guid === episodeGuid),
    [episodeGuid, episodes]
  );
  const footerPlayerRef = useRef<HTMLDivElement>();
  const [gutterBlockEnd, setGutterBlockEnd] = useState(0);
  const logoSizes = [
    `(min-width: ${styles.breakpointFull}) ${styles.logoSize}`,
    `${styles.logoSizeMobile}`
  ].join(',');
  const rootStyles = [
    `--gutter-size-block-end: ${playerShown ? gutterBlockEnd : 0}px;`,
    ...(accentColor
      ? [
          `--accent-color:${accentColor[0].split(' ')[0]};`,
          ...(accentColor.length > 1
            ? [`--accent-gradient: ${accentColor.join(',')};`]
            : [])
        ]
      : [])
  ].join('');

  const updateUrl = (guid?: string) => {
    const { protocol, host } = window.location;
    const baseUrl = `${protocol}//${host}/`;
    const url = new URL(router.asPath, baseUrl);

    url.searchParams.delete('ge');

    if (guid) {
      url.searchParams.set('ge', guid);
    }

    const newUrl = `${url.pathname}?${url.searchParams.toString()}`;

    router.push(newUrl, newUrl, {
      shallow: true
    });
  };

  const handleUrlChange = useCallback((event: PopStateEvent) => {
    const { protocol, host } = window.location;
    const baseUrl = `${protocol}//${host}/`;
    const url = new URL(event.state.as, baseUrl);
    const guid = url.searchParams.get('ge');

    if (guid) {
      dispatch({
        type: ListenActionTypes.LISTEN_VIEW_EPISODE,
        payload: guid
      });
    } else {
      dispatch({
        type: ListenActionTypes.LISTEN_VIEW_PODCAST
      });
    }
  }, []);

  const handleEpisodeClick = (guid: string) => {
    updateUrl(guid);
    dispatch({
      type: ListenActionTypes.LISTEN_VIEW_EPISODE,
      payload: guid
    });
  };

  const handleEpisodeBackClick = () => {
    updateUrl();
    dispatch({
      type: ListenActionTypes.LISTEN_VIEW_PODCAST
    });
  };

  const handleFollowButtonClick = () => {
    dispatch({ type: ListenActionTypes.LISTEN_PODCAST_SHOW_FOLLOW_DIALOG });
  };

  const handleFollowCloseClick = () => {
    dispatch({ type: ListenActionTypes.LISTEN_PODCAST_HIDE_FOLLOW_DIALOG });
  };

  const handleShareButtonClick = () => {
    dispatch({ type: ListenActionTypes.LISTEN_PODCAST_SHOW_SHARE_DIALOG });
  };

  const handleShareCloseClick = () => {
    dispatch({ type: ListenActionTypes.LISTEN_PODCAST_HIDE_SHARE_DIALOG });
  };

  const handleSupportButtonClick = () => {
    dispatch({ type: ListenActionTypes.LISTEN_PODCAST_SHOW_SUPPORT_DIALOG });
  };

  const handleSupportCloseClick = () => {
    dispatch({ type: ListenActionTypes.LISTEN_PODCAST_HIDE_SUPPORT_DIALOG });
  };

  const handleResize = useCallback(() => {
    setGutterBlockEnd(footerPlayerRef.current.getBoundingClientRect().height);
  }, []);

  /**
   * Setup/clean up window events.
   */
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('popstate', handleUrlChange);

    handleResize(); // Trigger resize handler to initialize gutter end value.

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [handleResize, handleUrlChange]);

  const renderMenu = useMemo(
    () => (
      <>
        <FollowMenu
          className={clsx(styles.menuButton, styles.followRssButton)}
          onOpen={handleFollowButtonClick}
          onClose={handleFollowCloseClick}
          isOpen={podcastFollowShown}
          portalId="embed-modals"
          followUrls={followUrls}
        />

        <ShareMenu
          className={clsx(styles.menuButton, styles.shareButton)}
          onOpen={handleShareButtonClick}
          onClose={handleShareCloseClick}
          isOpen={podcastShareShown}
          portalId="embed-modals"
          url={link}
          twitterTitle={title}
          emailSubject={title}
          emailBody="Check out this podcast!"
        />

        <SupportMenu
          className={clsx(styles.menuButton, styles.supportButton)}
          onOpen={handleSupportButtonClick}
          onClose={handleSupportCloseClick}
          isOpen={podcastSupportShown}
          portalId="embed-modals"
          supportUrls={supportUrls}
        />
      </>
    ),
    [
      followUrls,
      link,
      podcastFollowShown,
      podcastShareShown,
      podcastSupportShown,
      supportUrls,
      title
    ]
  );

  useEffect(() => {
    if (view === 'episode' && !episode) {
      dispatch({
        type: ListenActionTypes.LISTEN_VIEW_PODCAST
      });
    }
  }, [view, episode]);

  return (
    <>
      <Head>
        <style>{`:root {${rootStyles}} body { overflow: hidden; }`}</style>
      </Head>
      <ThemeVars theme="Listen" cssProps={styles} />
      <div className={styles.root} data-view={view} data-theme={theme}>
        <div className={styles.background}>
          <BackgroundImage imageUrl={bgImageUrl} />
        </div>

        <header className={styles.header}>
          <div className={styles.podcastLogo}>
            <PrxImage
              src={bgImageUrl}
              alt={`Logo for ${title}`}
              layout="fill"
              sizes={logoSizes}
            />
          </div>
          <div className={styles.podcastHeading}>
            <h1 className={styles.podcastTitle}>
              <Marquee>{title}</Marquee>
            </h1>
            <span className={styles.podcastAuthor}>{author}</span>
          </div>
          <div className={styles.podcastInfo}>
            <div className={styles.podcastContent}>
              <HtmlContent html={content} />
            </div>
            <div className={styles.podcastMenu}>{renderMenu}</div>
            {copyright && (
              <div className={styles.podcastCopyright}>{copyright}</div>
            )}
          </div>
        </header>

        <div className={styles.main}>
          <div
            className={clsx(styles.viewContainer, styles.podcastView)}
            {...(view.indexOf('podcast') === -1 && { inert: 'inert' })}
          >
            <div className={styles.podcastInfo}>
              <div className={styles.podcastContent}>
                <HtmlContent html={content} />
              </div>
              <div className={styles.podcastMenu}>{renderMenu}</div>
              {copyright && (
                <div className={styles.podcastCopyright}>{copyright}</div>
              )}
            </div>
            <div className={styles.podcastEpisodes}>
              <EpisodeList onEpisodeClick={handleEpisodeClick} />
            </div>
          </div>

          <div
            className={clsx(styles.viewContainer, styles.episodeView)}
            {...(view.indexOf('episode') === -1 && { inert: 'inert' })}
          >
            <Episode data={episode} onClose={handleEpisodeBackClick} />
          </div>
        </div>

        <footer className={styles.footer}>
          <FooterPlayer ref={footerPlayerRef} />
          <div className={styles.footerMain}>
            <a href="https://dovetail.prx.org" target="_blank" rel="noreferrer">
              <PrxDtLogo
                className={styles.logoPrxDt}
                aria-label="PRX Dovetail"
              />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Listen;
