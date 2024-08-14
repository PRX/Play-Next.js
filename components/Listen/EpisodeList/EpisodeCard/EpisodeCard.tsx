/**
 * @file EpisodeCard.tsx
 * Component for EpisodeList episode cards.
 */

import type { IListenEpisodeData } from '@interfaces/data';
import { CSSProperties, useCallback, useContext, useMemo } from 'react';
import clsx from 'clsx';
import { filesize } from 'filesize';
import Link from 'next/link';
import IconButton from '@components/IconButton';
import PrxImage from '@components/PrxImage';
import PlayerContext from '@contexts/PlayerContext';
import convertDurationStringToIntegerArray from '@lib/convert/string/convertDurationStringToIntegerArray';
import sumDurationParts from '@lib/math/time/sumDurationParts';
import formatDurationParts from '@lib/format/time/formatDurationParts';
import DownloadIcon from '@svg/icons/FileDownload.svg';
import ExplicitIcon from '@svg/icons/Explicit.svg';
import PlayIcon from '@svg/icons/PlayArrow.svg';
import PauseIcon from '@svg/icons/Pause.svg';
import PlayCircleIcon from '@svg/icons/PlayCircle.svg';
import PauseCircleIcon from '@svg/icons/PauseCircle.svg';
import listenStyles from '@components/Listen/Listen.module.scss';
import styles from './EpisodeCard.module.scss';

export interface IEpisodeCardProps {
  index: number;
  episode: IListenEpisodeData;
  onEpisodeClick(guid: string): void; // eslint-disable-line no-unused-vars
}

const EpisodeCard = ({ index, episode, onEpisodeClick }: IEpisodeCardProps) => {
  const {
    imageUrl: defaultThumbUrl,
    state,
    playTrack,
    pause
  } = useContext(PlayerContext);
  const { currentTrackIndex, playing } = state;
  const isCurrentTrack = index === currentTrackIndex;
  const {
    guid,
    title,
    subtitle,
    imageUrl,
    duration,
    explicit,
    pubDate,
    url,
    fileSize
  } = episode;
  const thumbSrc = imageUrl || defaultThumbUrl;
  const thumbnailSize = 100;
  const thumbnailSizeMobile = 40;
  const thumbSizes = [
    `(min-width: ${listenStyles.breakpointFull}) ${thumbnailSize}px`,
    `${thumbnailSizeMobile}px`
  ].join(',');
  const pubDateFormatted = useMemo(
    () =>
      new Intl.DateTimeFormat([], { dateStyle: 'long' }).format(
        new Date(pubDate)
      ),
    [pubDate]
  );
  const episodesDurationsInt = convertDurationStringToIntegerArray(duration);
  const episodesDurationSums = sumDurationParts([episodesDurationsInt]);
  const episodesDurationString = formatDurationParts(episodesDurationSums);
  const downloadLabel = filesize(fileSize);

  const handlePlayButtonClick = useCallback(() => {
    playTrack(index);
  }, [index, playTrack]);

  const handlePauseButtonClick = useCallback(() => {
    pause();
  }, [pause]);

  const handleEpisodeClick = useCallback(() => {
    onEpisodeClick(guid);
  }, [guid, onEpisodeClick]);

  return (
    <>
      {/* <ThemeVars theme="EpisodeCard" cssProps={styles} /> */}
      <div
        className={clsx(styles.root, {
          [styles.isCurrentTrack]: isCurrentTrack
        })}
        style={
          {
            '--episodeCard-thumbnail-size': `${thumbnailSize}px`,
            '--episodeCard-thumbnail-size--mobile': `${thumbnailSizeMobile}px`
          } as CSSProperties
        }
      >
        {thumbSrc ? (
          <div className={styles.thumbnail}>
            <PrxImage
              title={`Thumbnail for "${title}".`}
              src={thumbSrc}
              alt={`Thumbnail for "${title}".`}
              fill
              sizes={thumbSizes}
            />
            <span className={styles.buttons}>
              {playing && isCurrentTrack ? (
                <IconButton
                  className={styles.pause}
                  onClick={handlePauseButtonClick}
                  title="Pause Episode"
                >
                  <PauseIcon />
                </IconButton>
              ) : (
                <IconButton
                  className={styles.play}
                  onClick={handlePlayButtonClick}
                  title="Play Episode"
                >
                  <PlayIcon />
                </IconButton>
              )}
            </span>
          </div>
        ) : (
          <span />
        )}
        <div className={styles.main}>
          <button
            type="button"
            className={styles.title}
            onClick={handleEpisodeClick}
          >
            {title}
          </button>

          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}

          <div className={styles.footer}>
            <span className={styles.controls}>
              {playing && isCurrentTrack ? (
                <IconButton
                  className={styles.pause}
                  onClick={handlePauseButtonClick}
                  title="Pause Episode"
                >
                  <PauseCircleIcon />
                </IconButton>
              ) : (
                <IconButton
                  className={styles.play}
                  onClick={handlePlayButtonClick}
                  title="Play Episode"
                >
                  <PlayCircleIcon />
                </IconButton>
              )}
            </span>

            {explicit && (
              <span className={styles.explicit}>
                <ExplicitIcon
                  aria-label="Explicit Content"
                  className={styles.explicit}
                />
              </span>
            )}

            <span className={styles.info}>
              <div className={styles.infoWrapper}>
                <span className={styles.pubDate}>{pubDateFormatted}</span>
                <span className={styles.duration}>
                  {episodesDurationString}
                </span>
                <span className={styles.download}>
                  <Link
                    className={styles.downloadLink}
                    href={url}
                    download
                    title="Download Episode"
                  >
                    <DownloadIcon aria-hidden="true" />
                    {downloadLabel}
                  </Link>
                </span>
              </div>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default EpisodeCard;
