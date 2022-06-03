/**
 * @file PlayerProgress.tsx
 * Play progress bar control.
 */

import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef
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
}

const PlayerProgress: React.FC<IPlayerProgressProps> = ({
  updateFrequency = 500
}) => {
  const updateInterval = useRef(null);
  const trackRef = useRef(null as HTMLDivElement);
  const [state, dispatch] = useReducer(
    playerProgressStateReducer,
    playerProgressInitialState
  );
  const { scrubPosition, played, playedSeconds, duration } = state;
  const {
    audioElm,
    state: playerState,
    dispatch: playerDispatch
  } = useContext(PlayerContext);
  const {
    currentTrackIndex,
    tracks,
    playing,
    currentTime: playerCurrentTime
  } = playerState;
  const { duration: trackDuration } = tracks[currentTrackIndex];
  const progress = scrubPosition || played || 0;
  const progressStyles: IPlayerProgressCssProps = {
    '--progress': progress
  };
  const currentDuration = convertSecondsToDuration(Math.round(playedSeconds));
  const totalDuration = duration
    ? convertSecondsToDuration(Math.round(duration))
    : trackDuration;

  /**
   * Update scrub position on the progress track.
   * @param position Ratio of pointer horizontal location relative to
   * progress track.
   */
  const updateScrubPosition = useCallback((e: PointerEvent) => {
    const rect = trackRef.current.getBoundingClientRect();
    const position = e.offsetX / rect.width;

    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_SCRUB_POSITION,
      payload: position
    });
  }, []);

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
    playerDispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TIME,
      payload: scrubPosition * audioElm.duration
    });

    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS_TO_SCRUB_POSITION
    });

    trackRef.current.removeEventListener('pointermove', handlePointerMove);
  }, [audioElm.duration, handlePointerMove, playerDispatch, scrubPosition]);

  /**
   * Update state when player state's currentTime changes.
   */
  useEffect(() => {
    if (playerCurrentTime !== null) {
      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS,
        payload: {
          playedSeconds: playerCurrentTime,
          played: playerCurrentTime / duration
        }
      });
    }
  }, [duration, playerCurrentTime]);

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
    audioElm.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audioElm.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioElm, handleLoadedMetadata]);

  /**
   * Setup progress track event handlers.
   */
  useEffect(() => {
    const refElm = trackRef.current;
    trackRef.current.addEventListener('pointerdown', handlePointerDown);
    trackRef.current.addEventListener('pointerup', handlePointerUp);

    return () => {
      refElm.removeEventListener('pointerdown', handlePointerDown);
      refElm.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerDown, handlePointerUp]);

  return (
    <>
      <ThemeVars theme="PlayerProgress" cssProps={styles} />
      <div className={styles.root}>
        <div className={styles.currentTime}>{currentDuration}</div>
        <div className={styles.track} style={progressStyles} ref={trackRef} />
        <div className={styles.duration}>{totalDuration}</div>
      </div>
    </>
  );
};

export default PlayerProgress;
