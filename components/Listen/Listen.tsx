/**
 * @file Listen.tsx
 * Component for listen UX. SHould be able to used on the page, and in builder.
 */

import type React from 'react';
import type { CSSProperties } from 'react';
import type { IListenPageProps } from '@interfaces/page';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import clsx from 'clsx';
import ListenContext from '@contexts/ListenContext';
import PlayerContext from '@contexts/PlayerContext';
import BackgroundImage from '@components/BackgroundImage';
import HtmlContent from '@components/HtmlContent';
import Marquee from '@components/Marquee';
import FollowMenu from '@components/Player/FollowMenu';
import ShareMenu from '@components/ShareMenu';
import SupportMenu from '@components/Player/SupportMenu';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import {
  listenInitialState,
  listenStateReducer
} from '@states/listen/Listen.reducer';
import { ListenActionTypes } from '@states/listen/Listen.actions';
import PrxDtLogo from '@svg/PRX-DT-Logo.svg';
import EpisodeList from './EpisodeList';
import Episode from './Episode';
import FooterPlayer from './FooterPlayer';
import styles from './Listen.module.scss';
import episodeCardStyles from './EpisodeList/EpisodeCard/EpisodeCard.module.scss';
import FollowLinks from './FollowLinks';

// const FollowLinks = dynamic(() => import('./FollowLinks'));

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
    closedCaptionsShown,
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
    followLinks,
    supportUrls
  } = data;
  const { state: playerState } = useContext(PlayerContext);
  const { currentTrackIndex } = playerState;
  const playerShown = currentTrackIndex !== null && currentTrackIndex >= 0;
  const episode = useMemo(
    () => episodes && episodes.find(({ guid }) => guid === episodeGuid),
    [episodeGuid, episodes]
  );
  const {
    title: episodeTitle,
    imageUrl: episodeImage,
    content: episodeContent
  } = episode || {};
  const pageTitle = [title, episodeTitle].filter((v) => !!v).join(' | ');
  const imageUrl = !episode ? bgImageUrl : episodeImage;
  const description = (!episode ? content : episodeContent)?.replace(
    /<[^>]+>/g,
    ''
  );
  const hasFollowLinks = followLinks?.length > 1;
  const footerPlayerRef = useRef<HTMLDivElement>();
  const [gutterBlockEnd, setGutterBlockEnd] = useState(0);
  const logoSizes = [
    `(min-width: ${styles.breakpointFull}) ${styles.logoSize}`,
    `${styles.logoSizeMobile}`
  ].join(',');
  const rootStyles = {
    '--gutter-size-block-end': `${playerShown ? gutterBlockEnd : 0}px`,
    ...(accentColor && {
      '--accent-color': `${accentColor[0].split(' ')[0]}`,
      ...(accentColor.length > 1 && {
        ...accentColor.slice(1).reduce(
          (a, c, i) => ({
            ...a,
            [`--accent-color-${i + 2}`]: `${c.split(' ')[0]}`
          }),
          {}
        ),
        '--accent-gradient': `${accentColor.join(',')}`
      })
    })
  } as CSSProperties;
  const accentColorKeyframes = [...(accentColor || [])]
    .reverse()
    .map((color, index, all) => {
      const percent = (index / (all.length - 1)) * 100;
      return [percent, color];
    });

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
    const url = new URL(event.state?.as, baseUrl);
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
    setGutterBlockEnd(
      footerPlayerRef.current.parentElement.getBoundingClientRect().top -
        footerPlayerRef.current.getBoundingClientRect().top
    );
  }, []);

  const listenContextProps = useMemo(
    () => ({
      state,
      dispatch,
      config
    }),
    [config, state]
  );

  /**
   * Setup/clean up window events.
   */
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('popstate', handleUrlChange);

    // Trigger resize handler to initialize gutter end value.
    // Delay by footer player's translate transition duration.
    window.setTimeout(() => {
      handleResize();
    }, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [handleResize, handleUrlChange, playerShown]);

  const renderMenu = useMemo(
    () => (
      <>
        <FollowMenu
          className={clsx(styles.menuButton, styles.followRssButton)}
          onOpen={handleFollowButtonClick}
          onClose={handleFollowCloseClick}
          isOpen={podcastFollowShown}
          portalId="listen-modals"
          followLinks={followLinks}
        />

        <ShareMenu
          className={clsx(styles.menuButton, styles.shareButton)}
          onOpen={handleShareButtonClick}
          onClose={handleShareCloseClick}
          isOpen={podcastShareShown}
          portalId="listen-modals"
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
          portalId="listen-modals"
          supportUrls={supportUrls}
        />
      </>
    ),
    [
      followLinks,
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
    <ListenContext.Provider value={listenContextProps}>
      <Head>
        <title>{pageTitle}</title>
        <link rel="canonical" href={link} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={link} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:url" content={link} />
        {description && (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
            <meta name="twitter:description" content={description} />
          </>
        )}
        {imageUrl && (
          <>
            <meta property="og:image" content={imageUrl} />
            <meta name="twitter:image" content={imageUrl} />
          </>
        )}
      </Head>
      <ThemeVars theme="Listen" cssProps={styles} />
      <style>{`:root {  } body { overflow: hidden; } @keyframes ${
        episodeCardStyles['episode-card-highlight']
      } { ${accentColorKeyframes
        .map(([p, c]) => `${p}% { background-color: ${c}; }`)
        .join(' ')} }`}</style>
      <div
        className={styles.root}
        data-view={view}
        data-theme={theme}
        style={rootStyles}
      >
        <div className={styles.background}>
          <BackgroundImage imageUrl={bgImageUrl} />
        </div>

        <header className={styles.header}>
          <div className={styles.podcastLogo}>
            <PrxImage
              src={bgImageUrl}
              alt={`Logo for ${title}`}
              fill
              sizes={logoSizes}
            />
          </div>
          <div className={styles.podcastHeading}>
            <h1 className={styles.podcastTitle}>
              <Marquee>{title}</Marquee>
            </h1>
            <span className={styles.podcastAuthor}>{author}</span>
          </div>
          {hasFollowLinks && (
            <nav className={styles.podcastFollow}>
              <FollowLinks links={followLinks} />
            </nav>
          )}
          <nav className={styles.podcastMenu}>{renderMenu}</nav>
          <div className={styles.podcastInfo}>
            <div className={styles.podcastContent}>
              <HtmlContent html={content} />
            </div>
            {copyright && (
              <div className={styles.podcastCopyright}>{copyright}</div>
            )}
          </div>
        </header>

        {hasFollowLinks && (
          <div className={styles.follow}>
            <FollowLinks links={followLinks} />
          </div>
        )}

        <div className={styles.main}>
          <div
            className={clsx(styles.viewContainer, styles.podcastView)}
            {...(view.indexOf('podcast') === -1 && { inert: '' })}
          >
            <div className={styles.podcastInfo}>
              <div className={styles.podcastContent}>
                <HtmlContent html={content} />
              </div>
              {copyright && (
                <div className={styles.podcastCopyright}>{copyright}</div>
              )}
            </div>
            <div className={styles.podcastEpisodes}>
              <EpisodeList onEpisodeClick={handleEpisodeClick} />
              {/* {view.indexOf('podcast') !== -1 && (
              )} */}
            </div>
          </div>
          <div
            className={clsx(styles.viewContainer, styles.episodeView)}
            {...(view.indexOf('episode') === -1 && { inert: '' })}
          >
            <Episode
              key={episode?.guid}
              data={episode}
              onClose={handleEpisodeBackClick}
            />
          </div>
        </div>

        {closedCaptionsShown && (
          <div
            className={clsx(styles.closedCaptionsFeed)}
            id="listen-closed-caption-modal"
          />
        )}

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

        <div className={styles.modals} id="listen-modals" />
      </div>
    </ListenContext.Provider>
  );
};

export default Listen;
