/**
 * @file Episode.tsx
 * Component for viewing an episode on listen page.
 */

import type { IListenEpisodeData } from '@interfaces/data';
import { useCallback, useContext, useMemo, useState } from 'react';
import clsx from 'clsx';
import HtmlContent from '@components/HtmlContent';
import IconButton from '@components/IconButton';
import Marquee from '@components/Marquee';
import PrxImage from '@components/PrxImage';
import ShareMenu from '@components/ShareMenu';
import ThemeVars from '@components/ThemeVars';
import PlayerContext from '@contexts/PlayerContext';
import convertDurationStringToIntegerArray from '@lib/convert/string/convertDurationStringToIntegerArray';
import sumDurationParts from '@lib/math/time/sumDurationParts';
import formatDurationParts from '@lib/format/time/formatDurationParts';
import ArrowLeftIcon from '@svg/icons/ArrowLeft.svg';
import ExplicitIcon from '@svg/icons/Explicit.svg';
import PlayCircleIcon from '@svg/icons/PlayCircle.svg';
import PauseCircleIcon from '@svg/icons/PauseCircle.svg';
import listenStyles from '@components/Listen/Listen.module.scss';
import styles from './Episode.module.scss';

export interface IEpisodeProps {
  data: IListenEpisodeData;
  onClose(): void;
}

const Episode = ({ data, onClose }: IEpisodeProps) => {
  const {
    imageUrl: defaultThumbUrl,
    state,
    playTrack,
    pause
  } = useContext(PlayerContext);
  const { tracks, currentTrackIndex, playing } = state;
  const { guid, title, imageUrl, duration, explicit, pubDate, content, link } =
    data || {};
  const index = useMemo(
    () => tracks.findIndex((track) => track.guid === guid),
    [guid, tracks]
  );
  const isCurrentTrack = index === currentTrackIndex;
  const thumbSrc = imageUrl || defaultThumbUrl;
  const thumbSizes = [
    `(min-width: ${listenStyles.breakpointFull}) ${styles['--episode-thumbnail-size']}`,
    `${styles['--episode-thumbnail-size--mobile']}`
  ].join(',');
  const pubDateFormatted = useMemo(
    () =>
      pubDate &&
      new Intl.DateTimeFormat([], { dateStyle: 'long' }).format(
        new Date(pubDate)
      ),
    [pubDate]
  );
  const episodesDurationsInt = convertDurationStringToIntegerArray(duration);
  const episodesDurationSums = sumDurationParts([episodesDurationsInt]);
  const episodesDurationString = formatDurationParts(episodesDurationSums);
  const [shareShown, setShareShown] = useState(false);

  const handlePlayButtonClick = useCallback(() => {
    playTrack(index);
  }, [index, playTrack]);

  const handlePauseButtonClick = useCallback(() => {
    pause();
  }, [pause]);

  const handleEpisodeBackClick = () => {
    onClose();
  };

  const handleShareButtonClick = () => {
    setShareShown(true);
  };
  const handleShareCloseClick = () => {
    setShareShown(false);
  };

  if (!data) return null;

  return (
    <>
      <ThemeVars theme="Episode" cssProps={styles} />
      <div className={styles.root}>
        <div className={clsx(styles.nav, { [styles.isExplicit]: explicit })}>
          <IconButton onClick={handleEpisodeBackClick}>
            <ArrowLeftIcon />
          </IconButton>
          {explicit && (
            <span className={styles.explicit}>
              <ExplicitIcon className={styles.explicit} aria-label="Explicit" />
            </span>
          )}
          <Marquee>
            <h2 className={styles.title}>{title}</h2>
          </Marquee>
        </div>
        <div className={styles.main}>
          <div className={styles.header}>
            <div className={styles.thumbnail}>
              <PrxImage
                src={thumbSrc}
                alt={`Thumbnail for "${title}".`}
                layout="fill"
                sizes={thumbSizes}
              />
            </div>
            <div className={styles.headerMain}>
              <span className={styles.controls}>
                {playing && isCurrentTrack ? (
                  <IconButton
                    className={styles.pause}
                    onClick={handlePauseButtonClick}
                  >
                    <PauseCircleIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    className={styles.play}
                    onClick={handlePlayButtonClick}
                  >
                    <PlayCircleIcon />
                  </IconButton>
                )}
              </span>

              <span className={styles.info}>
                <span className={styles.infoWrapper}>
                  <span className={styles.pubDate}>{pubDateFormatted}</span>
                  <span className={styles.duration}>
                    {episodesDurationString}
                  </span>
                </span>
              </span>
            </div>
            <div className={styles.menu}>
              <ShareMenu
                className={clsx(styles.menuButton, styles.shareButton)}
                onOpen={handleShareButtonClick}
                onClose={handleShareCloseClick}
                isOpen={shareShown}
                portalId="episode-modals"
                url={link}
                twitterTitle={title}
                emailSubject={title}
                emailBody="Check out this episode!"
              />
            </div>
          </div>
          <div className={styles.content}>
            <HtmlContent html={content} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Episode;
