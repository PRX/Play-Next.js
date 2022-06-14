/**
 * @file Player.tsx
 * Higher order component for Audio Player
 */

import type React from 'react';
import type { IAudioData } from '@interfaces/data';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import {
  playerInitialState,
  playerStateReducer
} from '@states/player/Player.reducer';
import { PlayerActionTypes } from '@states/player/Player.actions';
import PlayerContext from '@contexts/PlayerContext';

export interface IPlayerProps extends React.PropsWithChildren<{}> {
  audio: IAudioData | IAudioData[];
  startIndex?: number;
  imageUrl?: string;
}

export interface KeyboardEventWithTarget extends KeyboardEvent {
  target: HTMLElement;
}

const Player: React.FC<IPlayerProps> = ({
  audio,
  startIndex,
  imageUrl,
  children
}) => {
  const tracks = Array.isArray(audio) ? audio : [audio];
  const [audioElm, setAudioElm] = useState(null as HTMLAudioElement);
  const [state, dispatch] = useReducer(playerStateReducer, {
    ...playerInitialState,
    tracks,
    ...(startIndex && { currentTrackIndex: startIndex })
  });
  const { playing, currentTrackIndex, currentTime, muted, volume } = state;
  const currentTrack = tracks[currentTrackIndex];
  const isLastTrack = currentTrackIndex === tracks.length - 1;
  const { url } = currentTrack;

  const boundedTime = useCallback(
    (time: number) => Math.min(Math.max(0.00001, time), audioElm.duration),
    [audioElm?.duration]
  );

  const boundedVolume = useCallback(
    (newVolume: number) => Math.min(Math.max(0, newVolume), 1),
    []
  );

  const play = () => {
    dispatch({ type: PlayerActionTypes.PLAYER_PLAY });
  };

  const pause = () => {
    dispatch({ type: PlayerActionTypes.PLAYER_PAUSE });
  };

  const togglePlayPause = () => {
    dispatch({ type: PlayerActionTypes.PLAYER_TOGGLE_PLAYING });
  };

  const seekTo = useCallback(
    (time: number) => {
      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TIME,
        payload: boundedTime(time)
      });
    },
    [boundedTime]
  );

  const seekBy = useCallback(
    (seconds: number) => {
      seekTo(audioElm.currentTime + seconds);
    },
    [audioElm?.currentTime, seekTo]
  );

  const seekToRelative = useCallback(
    (ratio: number) => {
      seekTo(audioElm.duration * ratio);
    },
    [audioElm?.duration, seekTo]
  );

  const setTrack = (index: number) => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TRACK_INDEX,
      payload: index
    });
  };

  const previousTrack = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_PREVIOUS_TRACK
    });
  };

  const nextTrack = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_NEXT_TRACK
    });
  };

  const volumeUp = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_VOLUME,
      payload: boundedVolume(audioElm.volume + 0.05)
    });
  }, [audioElm?.volume, boundedVolume]);

  const volumeDown = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_VOLUME,
      payload: boundedVolume(audioElm.volume - 0.05)
    });
  }, [audioElm?.volume, boundedVolume]);

  const toggleMute = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_TOGGLE_MUTED
    });
  };

  const playerContextValue = useMemo(
    () => ({
      audioElm,
      imageUrl,
      state,
      dispatch,
      play,
      pause,
      togglePlayPause,
      toggleMute,
      seekTo,
      seekBy,
      seekToRelative,
      setTrack,
      previousTrack,
      nextTrack
    }),
    [audioElm, imageUrl, seekBy, seekTo, seekToRelative, state]
  );

  const handlePlay = useCallback(() => {
    dispatch({ type: PlayerActionTypes.PLAYER_PLAY });
  }, []);

  const handlePause = useCallback(() => {
    if (!audioElm.ended) {
      dispatch({ type: PlayerActionTypes.PLAYER_PAUSE });
    }
  }, [audioElm?.ended]);

  const handleLoadedMetadata = useCallback(() => {
    // When audio data loads, update duration and current time, then start
    // playing if we were playing before.
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_DURATION,
      payload: audioElm?.duration
    });
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TIME,
      payload: 0.00001
    });

    if (playing) {
      audioElm.play();
    }
  }, [audioElm, playing]);

  const handleEnded = useCallback(() => {
    if (!isLastTrack) {
      dispatch({ type: PlayerActionTypes.PLAYER_NEXT_TRACK });
    }
  }, [isLastTrack]);

  const handleHotkey = useCallback(
    (event: KeyboardEventWithTarget) => {
      const key = event.code || event.key;
      switch (key) {
        case 'KeyS':
          audioElm.playbackRate = 3 - audioElm.playbackRate;
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'Space':
          if (event.target.nodeName !== 'BUTTON') {
            togglePlayPause();
          }
          break;
        case 'KeyK':
          togglePlayPause();
          break;
        case 'KeyJ':
          seekBy(-10);
          break;
        case 'KeyL':
          seekBy(10);
          break;
        case 'ArrowLeft':
          seekBy(-5);
          break;
        case 'ArrowRight':
          seekBy(5);
          break;
        case 'Comma':
          if (!playing) {
            seekBy(-1 / 30);
          }
          break;
        case 'Period':
          if (!playing) {
            seekBy(1 / 30);
          }
          break;
        case 'Home':
          seekTo(0);
          break;
        case 'End':
          seekToRelative(1);
          break;
        case 'Digit1':
          seekToRelative(0.1);
          break;
        case 'Digit2':
          seekToRelative(0.2);
          break;
        case 'Digit3':
          seekToRelative(0.3);
          break;
        case 'Digit4':
          seekToRelative(0.4);
          break;
        case 'Digit5':
          seekToRelative(0.5);
          break;
        case 'Digit6':
          seekToRelative(0.6);
          break;
        case 'Digit7':
          seekToRelative(0.7);
          break;
        case 'Digit8':
          seekToRelative(0.8);
          break;
        case 'Digit9':
          seekToRelative(0.9);
          break;
        case 'Digit0':
          seekTo(0);
          break;
        case 'BracketLeft':
          previousTrack();
          break;
        case 'BracketRight':
          nextTrack();
          break;
        case 'ArrowUp':
          volumeUp();
          break;
        case 'ArrowDown':
          volumeDown();
          break;
        default:
          break;
      }
    },
    [audioElm, playing, seekBy, seekTo, seekToRelative, volumeDown, volumeUp]
  );

  useEffect(() => {
    // Setup event handlers on audio element.
    audioElm?.addEventListener('play', handlePlay);
    audioElm?.addEventListener('pause', handlePause);
    audioElm?.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElm?.addEventListener('ended', handleEnded);

    window.addEventListener('keydown', handleHotkey);

    return () => {
      // Cleanup event handlers between dependency changes.
      audioElm?.removeEventListener('play', handlePlay);
      audioElm?.removeEventListener('pause', handlePause);
      audioElm?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElm?.removeEventListener('ended', handleEnded);

      window.removeEventListener('keydown', handleHotkey);
    };
  }, [
    audioElm,
    handleLoadedMetadata,
    handlePause,
    handlePlay,
    handleEnded,
    handleHotkey
  ]);

  useEffect(() => {
    if (!playing) {
      audioElm?.pause();
    } else {
      audioElm?.play();
    }
  }, [audioElm, playing]);

  useEffect(() => {
    if (!audioElm) return;
    audioElm.muted = muted;
  }, [audioElm, muted]);

  useEffect(() => {
    if (!audioElm) return;
    audioElm.volume = volume;
  }, [audioElm, volume]);

  useEffect(() => {
    if (audioElm) {
      audioElm.currentTime = currentTime;
    }
  }, [audioElm, currentTime]);

  useEffect(() => {
    if (!audioElm) {
      // Initiate audio element.
      setAudioElm(new Audio(url));
    } else {
      // Update audio src. Pause first to prevent load while playing error.
      audioElm.pause();
      audioElm.src = url;
    }

    return () => {
      // Pause and clean up on unmount
      audioElm?.pause();
    };
  }, [audioElm, url]);

  return (
    audioElm && (
      <PlayerContext.Provider value={playerContextValue}>
        {children}
      </PlayerContext.Provider>
    )
  );
};

export default Player;
