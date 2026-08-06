/**
 * @file PlayerProgress.tsx
 * Play progress bar control.
 */

import type React from 'react';
import type { IAudioData } from '@interfaces/data/IAudioData';
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
import convertDurationToSeconds from '@lib/convert/string/convertDurationToSeconds';
import convertSecondsToDuration from '@lib/convert/string/convertSecondsToDuration';
import styles from './PlayerProgress.module.scss';

export interface IPlayerProgressProps {}

export interface IPlayerProgressCssProps extends React.CSSProperties {
  '--progress': number;
  '--track-width'?: string;
}

const PlayerProgress: React.FC<IPlayerProgressProps> = () => {
  const trackRef = useRef<HTMLDivElement>();
  const [state, dispatch] = useReducer(
    playerProgressStateReducer,
    playerProgressInitialState
  );
  const { scrubPosition, played, playedSeconds, duration } = state;
  const { el, state: playerState, seekTo } = useContext(PlayerContext);
  const {
    currentTrackIndex,
    tracks,
    currentTime: playerCurrentTime
  } = playerState;
  const { duration: trackDuration } =
    tracks[currentTrackIndex] || ({} as IAudioData);
  const [progressStyles, setProgressStyles] = useState({});
  const totalDuration = duration
    ? convertSecondsToDuration(Math.round(duration))
    : convertSecondsToDuration(trackDuration);
  const totalDurationSeconds =
    duration || convertDurationToSeconds(trackDuration);
  const currentDuration = convertSecondsToDuration(
    Math.round(
      scrubPosition ? scrubPosition * totalDurationSeconds : playedSeconds
    )
  );
  const progress =
    scrubPosition || played || playedSeconds / totalDurationSeconds || 0;

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
      const { currentTime: ct = 0, duration: dur } = el.current || {};
      const d = !isNaN(dur) ? dur : 0;
      const updatedPlayed = seconds || seconds === 0 ? seconds : ct;

      updateProgressStyles();

      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS,
        payload: {
          duration: d,
          playedSeconds: updatedPlayed,
          played: updatedPlayed / (d || totalDurationSeconds)
        }
      });
    },
    [el.current, totalDurationSeconds, updateProgressStyles]
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
    seekTo(scrubPosition * totalDurationSeconds);

    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS_TO_SCRUB_POSITION
    });

    trackRef.current.removeEventListener('pointermove', handlePointerMove);
  }, [totalDurationSeconds, handlePointerMove, scrubPosition, seekTo]);

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
  }, [playerCurrentTime, updateProgress]);

  /**
   * Setup audio element event handlers.
   */
  useEffect(() => {
    const elCurrent = el.current;

    elCurrent?.addEventListener('loadedmetadata', handleLoadedMetadata);
    elCurrent?.addEventListener('timeupdate', handleUpdate);

    return () => {
      elCurrent?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      elCurrent?.removeEventListener('timeupdate', handleUpdate);
    };
  }, [el.current, handleLoadedMetadata, handleUpdate]);

  /**
   * Setup progress track event handlers.
   */
  useEffect(() => {
    const refElm = trackRef.current;

    refElm.addEventListener('pointerdown', handlePointerDown);
    refElm.addEventListener('pointerup', handlePointerUp);

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
