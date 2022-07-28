/**
 * @file Listen.tsx
 * Component for listen UX. SHould be able to used on the page, and in builder.
 */

import type React from 'react';
import { useEffect, useReducer } from 'react';
import clsx from 'clsx';
import BackgroundImage from '@components/BackgroundImage';
import HtmlContent from '@components/HtmlContent';
import IconButton from '@components/IconButton';
import Marquee from '@components/Marquee';
import Player from '@components/Player';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import { IListenPageProps } from '@interfaces/page';
import {
  listenInitialState,
  listenStateReducer
} from '@states/listen/Listen.reducer';
import { ListenActionTypes } from '@states/listen/Listen.actions';
import CloseIcon from '@svg/icons/Close.svg';
import styles from './Listen.module.scss';
import EpisodeList from './EpisodeList';

const Listen = ({ config, data }: IListenPageProps) => {
  const { episodeGuid: configEpisodeGuid } = config;
  const [state, dispatch] = useReducer(listenStateReducer, {
    ...listenInitialState,
    view: configEpisodeGuid ? 'episode-init' : 'podcast-init',
    ...(configEpisodeGuid && { episodeGuid: configEpisodeGuid })
  });
  const { view, episodeGuid } = state;
  const { title, author, content, copyright, episodes, bgImageUrl } = data;
  const episode =
    episodeGuid && episodes.find(({ guid }) => guid === episodeGuid);
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

  useEffect(() => {
    if (view === 'episode' && !episode) {
      dispatch({
        type: ListenActionTypes.LISTEN_VIEW_PODCAST
      });
    }
  }, [view, episode]);

  return (
    <>
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
              <div className={styles.podcastMenu} />
              <div className={styles.podcastCopyright}>{copyright}</div>
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
                <div className={styles.podcastMenu} />
                <div className={styles.podcastCopyright}>{copyright}</div>
              </div>
              <div className={styles.podcastEpisodes}>
                <EpisodeList onEpisodeClick={handleEpisodeClick} />
              </div>
            </div>

            <div
              className={clsx(styles.viewContainer, styles.episodeView)}
              {...(view.indexOf('episode') === -1 && { inert: 'inert' })}
            >
              <h2>
                <IconButton onClick={handleEpisodeBackClick}>
                  <CloseIcon />
                </IconButton>
                {episode?.title}
              </h2>
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
