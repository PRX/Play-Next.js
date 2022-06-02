/**
 * @file Playlist.tsx
 * Comment to list player's audio tracks that can be used to change currently
 * playing track.
 */

import { useContext, useRef } from 'react';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import styles from './Playlist.module.scss';

const Playlist = () => {
  const {
    imageUrl: defaultThumbUrl,
    state,
    dispatch
  } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const rootRef = useRef(null);
  const playlistDurationSums = tracks
    ?.map(
      ({ duration }) =>
        duration
          .split(':') // Split sting on colons to get duration parts.
          .map((v) => parseInt(v, 10)) // Parse each part into integers.
          .reduce((a, c) => [c, ...a], []) // Reverse order of parts. ie. [seconds, minutes [, hours]].
    )
    .reduce(
      (a, [s, m, h]) => {
        const sumSeconds = a[0] + s;
        const seconds = sumSeconds % 60;
        const minutesFromSeconds =
          sumSeconds > 60 ? (sumSeconds - seconds) / 60 : 0;
        const sumMinutes = a[1] + m + minutesFromSeconds;
        const minutes = sumMinutes % 60;
        const hoursFromMinutes =
          sumMinutes > 60 ? (sumMinutes - minutes) / 60 : 0;
        const sumHours = a[2] + (h || 0);
        const hours = sumHours + hoursFromMinutes;

        return [seconds, minutes, hours];
      },
      [0, 0, 0]
    );
  const playlistDurationString = [
    // When we have hours, display as `HHhr MMmin`, rounding minutes up.
    ...(playlistDurationSums[2]
      ? [
          `${playlistDurationSums[2]}hr`,
          ...(playlistDurationSums[1]
            ? [`${playlistDurationSums[1] + (playlistDurationSums[0] > 30)}min`]
            : [])
        ]
      : // When missing hours, display as `MMmin`.
        [
          ...(playlistDurationSums[1] ? [`${playlistDurationSums[1]}min`] : [])
        ]),
    // Display seconds when missing hours and we have seconds.
    ...(!playlistDurationSums[2] && playlistDurationSums[0]
      ? [`${playlistDurationSums[0]}sec`]
      : [])
  ].join(' ');

  const handleTrackClick = (index: number) => () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TRACK_INDEX,
      payload: index
    });
    dispatch({
      type: PlayerActionTypes.PLAYER_PLAY
    });
  };

  return (
    tracks && (
      <div className={styles.root}>
        <ThemeVars theme="Playlist" cssProps={styles} />
        <header className={styles.header}>
          <span>
            {tracks?.length === 1 ? '1 Episode' : `${tracks.length} Episodes`}
          </span>
          <span>{playlistDurationString}</span>
        </header>
        <div ref={rootRef} className={styles.playlist}>
          <div className={styles.tracks}>
            {tracks.map((track, index) => {
              const { guid, title, imageUrl, duration } = track;
              const thumbSrc = imageUrl || defaultThumbUrl;
              return (
                <button
                  type="button"
                  className={clsx(styles.track, {
                    [styles.isCurrentTrack]: index === currentTrackIndex
                  })}
                  key={guid}
                  onClick={handleTrackClick(index)}
                >
                  {thumbSrc ? (
                    <div className={styles.trackThumbnail}>
                      <PrxImage
                        src={thumbSrc}
                        alt={`Thumbnail for "${title}".`}
                        layout="raw"
                        width={styles['--playlist-thumbnail-size']}
                        height={styles['--playlist-thumbnail-size']}
                        lazyRoot={rootRef}
                      />
                    </div>
                  ) : (
                    <span />
                  )}
                  <span className={styles.trackTitle}>{title}</span>
                  <span className={styles.trackDuration}>{duration}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
};

export default Playlist;
