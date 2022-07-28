/**
 * @file EpisodeList.tsx
 * Component to list episodes on listen page.
 */

import type React from 'react';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import clsx from 'clsx';
import convertDurationStringToIntegerArray from '@lib/convert/string/convertDurationStringToIntegerArray';
import convertSecondsToDuration from '@lib/convert/string/convertSecondsToDuration';
import formatDurationParts from '@lib/format/time/formatDurationParts';
import sumDurationParts from '@lib/math/time/sumDurationParts';
import IconButton from '@components/IconButton';
import PlayerContext from '@contexts/PlayerContext';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import ExplicitIcon from '@svg/icons/Explicit.svg';
import PlayIcon from '@svg/icons/PlayArrow.svg';
import PauseIcon from '@svg/icons/Pause.svg';
import SwapVertIcon from '@svg/icons/SwapVert.svg';
import styles from './EpisodeList.module.scss';

export interface IEpisodeListProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onEpisodeClick(guid: string): void; // eslint-disable-line no-unused-vars
}

const EpisodeList: React.FC<IEpisodeListProps> = ({
  className,
  onEpisodeClick,
  ...props
}) => {
  const {
    imageUrl: defaultThumbUrl,
    state,
    setTracks,
    playTrack,
    pause
  } = useContext(PlayerContext);
  const { tracks, currentTrackIndex, playing } = state;
  const rootRef = useRef(null);
  const [playlistStyles, setPlaylistStyles] = useState({});
  const [reversed, setReversed] = useState(false);
  const playlistDurationsInt = tracks?.map(({ duration }) =>
    convertDurationStringToIntegerArray(duration)
  );
  const playlistDurationSums = sumDurationParts(playlistDurationsInt);
  const playlistDurationString = formatDurationParts(playlistDurationSums);

  const updatePlaylistStyles = useCallback(() => {
    const rect = rootRef.current.getBoundingClientRect();
    setPlaylistStyles({
      '--playlist-top': `${rect.top}px`,
      '--playlist-height': `${rect.height}px`
    });
  }, []);

  const handleSortClick = () => {
    const reversedTracks = [...tracks].reverse();

    setReversed(!reversed);
    setTracks(reversedTracks);
  };

  const handlePlayButtonClick = useCallback(
    (index: number) => () => {
      playTrack(index);
    },
    [playTrack]
  );

  const handlePauseButtonClick = useCallback(() => {
    pause();
  }, [pause]);

  const handleEpisodeClick = useCallback(
    (guid: string) => () => {
      onEpisodeClick(guid);
    },
    [onEpisodeClick]
  );

  const handleResize = useCallback(() => {
    updatePlaylistStyles();
  }, [updatePlaylistStyles]);

  const renderEpisodes = useMemo(
    () => (
      <>
        {tracks.map((track, index) => {
          const { guid, title, imageUrl, duration, explicit } = track;
          const thumbSrc = imageUrl || defaultThumbUrl;
          const trackDuration =
            duration?.indexOf(':') !== -1
              ? duration
              : convertSecondsToDuration(parseInt(duration, 10));
          return (
            <div
              className={clsx(styles.track, {
                [styles.isCurrentTrack]: index === currentTrackIndex,
                [styles.isExplicit]: explicit
              })}
              key={guid}
            >
              {thumbSrc ? (
                <div className={styles.trackThumbnail}>
                  <PrxImage
                    src={thumbSrc}
                    alt={`Thumbnail for "${title}".`}
                    layout="raw"
                    width={styles['--episodeList-thumbnail-size']}
                    height={styles['--episodeList-thumbnail-size']}
                    lazyRoot={rootRef}
                  />
                </div>
              ) : (
                <span />
              )}
              {playing && currentTrackIndex === index ? (
                <IconButton onClick={handlePauseButtonClick}>
                  <PauseIcon />
                </IconButton>
              ) : (
                <IconButton onClick={handlePlayButtonClick(index)}>
                  <PlayIcon />
                </IconButton>
              )}
              <button
                type="button"
                className={styles.trackTitle}
                onClick={handleEpisodeClick(guid)}
              >
                {title}
              </button>
              {explicit && (
                <span className={styles.explicit}>
                  <ExplicitIcon
                    className={styles.explicit}
                    aria-label="Explicit"
                  />
                </span>
              )}
              <span className={styles.trackDuration}>{trackDuration}</span>
            </div>
          );
        })}
      </>
    ),
    [
      currentTrackIndex,
      defaultThumbUrl,
      handleEpisodeClick,
      handlePauseButtonClick,
      handlePlayButtonClick,
      playing,
      tracks
    ]
  );

  useEffect(() => {
    updatePlaylistStyles();

    setTimeout(() => {
      updatePlaylistStyles();
    }, 1000);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, updatePlaylistStyles]);

  return (
    tracks && (
      <div {...props} className={clsx(styles.root, className)}>
        <ThemeVars theme="EpisodeList" cssProps={styles} />
        <header className={styles.header}>
          <button
            type="button"
            className={styles.button}
            onClick={handleSortClick}
          >
            <span
              className={clsx(styles.buttonIcon, {
                [styles.up]: !reversed,
                [styles.down]: reversed
              })}
            >
              <SwapVertIcon aria-label="Swap episode order" />
            </span>
            {tracks?.length === 1 ? '1 Episode' : `${tracks.length} Episodes`}
          </button>
          <span>{playlistDurationString}</span>
        </header>
        <div ref={rootRef} className={styles.playlist} style={playlistStyles}>
          <div className={styles.tracks}>{renderEpisodes}</div>
        </div>
      </div>
    )
  );
};

export default EpisodeList;
