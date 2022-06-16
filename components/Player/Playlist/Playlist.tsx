/**
 * @file Playlist.tsx
 * Comment to list player's audio tracks that can be used to change currently
 * playing track.
 */

import type React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import convertDurationStringToIntegerArray from '@lib/convert/string/convertDurationStringToIntegerArray';
import formatDurationParts from '@lib/format/time/formatDurationParts';
import sumDurationParts from '@lib/math/time/sumDurationParts';
import PlayerContext from '@contexts/PlayerContext';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import ExplicitIcon from '@svg/icons/Explicit.svg';
import styles from './Playlist.module.scss';

export interface IPlaylistProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

const Playlist: React.FC<IPlaylistProps> = ({ className, ...props }) => {
  const {
    imageUrl: defaultThumbUrl,
    state,
    play,
    setTrack
  } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const rootRef = useRef(null);
  const [playlistStyles, setPlaylistStyles] = useState({});
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

  const handleTrackClick = (index: number) => () => {
    setTrack(index);

    // Delay playing to give audio a chance to update src.
    setTimeout(() => {
      play();
    }, 200);
  };

  const handleResize = useCallback(() => {
    updatePlaylistStyles();
  }, [updatePlaylistStyles]);

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
        <ThemeVars theme="Playlist" cssProps={styles} />
        <header className={styles.header}>
          <span>
            {tracks?.length === 1 ? '1 Episode' : `${tracks.length} Episodes`}
          </span>
          <span>{playlistDurationString}</span>
        </header>
        <div ref={rootRef} className={styles.playlist} style={playlistStyles}>
          <div className={styles.tracks}>
            {tracks.map((track, index) => {
              const { guid, title, imageUrl, duration, explicit } = track;
              const thumbSrc = imageUrl || defaultThumbUrl;
              return (
                <button
                  type="button"
                  className={clsx(styles.track, {
                    [styles.isCurrentTrack]: index === currentTrackIndex,
                    [styles.isExplicit]: explicit
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
                  {explicit && (
                    <span className={styles.explicit}>
                      <ExplicitIcon
                        className={styles.explicit}
                        aria-label="Explicit"
                      />
                    </span>
                  )}
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
