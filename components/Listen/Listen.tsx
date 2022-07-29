/**
 * @file Listen.tsx
 * Component for listen UX. SHould be able to used on the page, and in builder.
 */

import type React from 'react';
import { useEffect, useMemo, useReducer } from 'react';
import Head from 'next/head';
import clsx from 'clsx';
import BackgroundImage from '@components/BackgroundImage';
import HtmlContent from '@components/HtmlContent';
import Marquee from '@components/Marquee';
import Player from '@components/Player';
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
import EpisodeList from './EpisodeList';
import styles from './Listen.module.scss';
import Episode from './Episode';

const Listen = ({ config, data }: IListenPageProps) => {
  const { episodeGuid: configEpisodeGuid } = config;
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
  const episode = useMemo(
    () => episodes && episodes.find(({ guid }) => guid === episodeGuid),
    [episodeGuid, episodes]
  );
  const logoSizes = [
    `(min-width: ${styles.breakpointFull}) ${styles.logoSize}`,
    `${styles.logoSizeMobile}`
  ].join(',');

  const handleEpisodeClick = (guid: string) => {
    dispatch({
      type: ListenActionTypes.LISTEN_VIEW_EPISODE,
      payload: guid
    });
  };

  const handleEpisodeBackClick = () => {
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
        <style>{'body { overflow: hidden; }'}</style>
      </Head>
      <ThemeVars theme="Listen" cssProps={styles} />
      <Player audio={episodes}>
        <div className={styles.root} data-view={view}>
          <div className={styles.background}>
            <BackgroundImage imageUrl={bgImageUrl} />
          </div>

          <header className={styles.header}>
            <div className={styles.podcastLogo}>
              <PrxImage src={bgImageUrl} layout="fill" sizes={logoSizes} />
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
            <div className={styles.player}>Player</div>
            Hosted on PRX Dovetail
          </footer>
        </div>
      </Player>
    </>
  );
};

export default Listen;
