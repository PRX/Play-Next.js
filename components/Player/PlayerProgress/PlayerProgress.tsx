/**
 * @file PlayerProgress.tsx
 * Play progress bar control.
 */

import type React from 'react';
import {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import {
  playerProgressInitialState,
  playerProgressStateReducer
} from '@states/player/PlayerProgress.reducer';
import ThemeVars from '@components/ThemeVars';
import convertSecondsToDuration from '@lib/convert/string/convertSecondsToDuration';
import styles from './PlayerProgress.module.scss';

export interface IPlayerProgressProps {
  updateFrequency?: number;
}

export interface IPlayerProgressCssProps extends React.CSSProperties {
  '--progress': number;
  '--track-width'?: string;
}

const PlayerProgress: React.FC<IPlayerProgressProps> = ({
  updateFrequency = 500
}) => {
  const updateInterval = useRef(null);
  const trackRef = useRef<HTMLDivElement>();
  const [state, dispatch] = useReducer(
    playerProgressStateReducer,
    playerProgressInitialState
  );
  const { scrubPosition, played, playedSeconds, duration } = state;
  const { audioElm, state: playerState, seekTo } = useContext(PlayerContext);
  const {
    currentTrackIndex,
    tracks,
    playing,
    currentTime: playerCurrentTime
  } = playerState;
  const { duration: trackDuration } = tracks[currentTrackIndex];
  const progress = scrubPosition || played || 0;
  const [progressStyles, setProgressStyles] = useState({});
  const currentDuration = convertSecondsToDuration(Math.round(playedSeconds));
  const totalDuration = duration
    ? convertSecondsToDuration(Math.round(duration))
    : trackDuration;

  /**
   * Update progress styles.
   */
  const updateProgressStyles = useCallback(() => {
    const rect = trackRef.current.getBoundingClientRect();
    setProgressStyles({
      '--track-width': `${rect.width}px`
    });
  }, []);

  /**
   * Update scrub position on the progress track.
   * @param position Ratio of pointer horizontal location relative to
   * progress track.
   */
  const updateScrubPosition = useCallback((e: PointerEvent) => {
    const rect = trackRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(e.offsetX / rect.width, 1));

    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_SCRUB_POSITION,
      payload: position
    });
  }, []);

  /**
   * Update player progress visuals.
   */
  const updateProgress = useCallback(
    (seconds?: number) => {
      const { currentTime: ct, duration: d } = audioElm;
      const updatedPlayed = seconds || seconds === 0 ? seconds : ct;

      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS,
        payload: {
          duration: d,
          playedSeconds: updatedPlayed,
          played: updatedPlayed / d
        }
      });
    },
    [audioElm]
  );

  /**
   * Update state when audio metadata is loaded.
   */
  const handleLoadedMetadata = useCallback(() => {
    updateProgress();
  }, [updateProgress]);

  /**
   * Updated state on interval tick.
   */
  const handleUpdate = useCallback(() => {
    updateProgress();
  }, [updateProgress]);

  /**
   * Handle pointer move event on progress track.
   * @param e Pointer Event
   */
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      updateScrubPosition(e);
    },
    [updateScrubPosition]
  );

  /**
   * Handle pointer down event on progress track.
   * @param e Pointer Event
   */
  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      trackRef.current.addEventListener('pointermove', handlePointerMove);
      trackRef.current.setPointerCapture(e.pointerId);

      updateScrubPosition(e);
    },
    [handlePointerMove, updateScrubPosition]
  );

  /**
   * Handle pointer down event on progress track.
   * @param e Pointer Event
   */
  const handlePointerUp = useCallback(() => {
    seekTo(scrubPosition * audioElm.duration);

    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS_TO_SCRUB_POSITION
    });

    trackRef.current.removeEventListener('pointermove', handlePointerMove);
  }, [audioElm?.duration, handlePointerMove, scrubPosition, seekTo]);

  /**
   * Window resize handler.
   */
  const handleResize = useCallback(() => {
    updateProgressStyles();
  }, [updateProgressStyles]);

  /**
   * Update state when player state's currentTime changes.
   */
  useEffect(() => {
    if (playerCurrentTime !== null) {
      updateProgress(playerCurrentTime);
    }
  }, [duration, playerCurrentTime, updateProgress]);

  /**
   * Setup update interval.
   */
  useEffect(() => {
    clearInterval(updateInterval.current);

    if (playing) {
      updateInterval.current = setInterval(handleUpdate, updateFrequency);
    }

    return () => {
      clearInterval(updateInterval.current);
    };
  }, [playing, updateFrequency, handleUpdate]);

  /**
   * Setup audio element event handlers.
   */
  useEffect(() => {
    audioElm?.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audioElm?.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioElm, handleLoadedMetadata]);

  /**
   * Setup progress track event handlers.
   */
  useEffect(() => {
    const refElm = trackRef.current;
    trackRef.current.addEventListener('pointerdown', handlePointerDown);
    trackRef.current.addEventListener('pointerup', handlePointerUp);

    window.addEventListener('resize', handleResize);

    return () => {
      refElm.removeEventListener('pointerdown', handlePointerDown);
      refElm.removeEventListener('pointerup', handlePointerUp);

      window.removeEventListener('resize', handleResize);
    };
  }, [handlePointerDown, handlePointerUp, handleResize]);

  return (
    <>
      <ThemeVars theme="PlayerProgress" cssProps={styles} />
      <div className={styles.root}>
        <div className={styles.currentTime}>{currentDuration}</div>
        <div
          className={styles.track}
          style={{ ...progressStyles, '--progress': progress } as CSSProperties}
          ref={trackRef}
        />
        <div className={styles.duration}>{totalDuration}</div>
      </div>
    </>
  );
};

export default PlayerProgress;
