/**
 * @file Player.tsx
 * Higher order component for Audio Player
 */

import type React from 'react';
import type { IAudioData } from '@interfaces/data';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  playerInitialState,
  playerStateReducer
} from '@states/player/Player.reducer';
import { PlayerActionTypes } from '@states/player/Player.actions';
import PlayerContext from '@contexts/PlayerContext';
import convertDurationToSeconds from '@lib/convert/string/convertDurationToSeconds';

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
  const audioElm = useRef<HTMLAudioElement>();
  const [state, dispatch] = useReducer(playerStateReducer, {
    ...playerInitialState,
    tracks,
    ...(startIndex && { currentTrackIndex: startIndex })
  });
  const { playing, currentTrackIndex, currentTime, muted, volume } = state;
  const currentTrack = tracks[currentTrackIndex];
  const currentTrackDuration = useMemo(
    () => convertDurationToSeconds(currentTrack.duration),
    [currentTrack.duration]
  );
  const isLastTrack = currentTrackIndex === tracks.length - 1;
  const { url } = currentTrack;

  const boundedTime = useCallback(
    (time: number) =>
      Math.min(
        Math.max(0.00001, time),
        audioElm.current.duration || currentTrackDuration
      ),
    [currentTrackDuration]
  );

  const boundedVolume = useCallback(
    (newVolume: number) => Math.min(Math.max(0, newVolume), 1),
    []
  );

  const play = () => {
    dispatch({ type: PlayerActionTypes.PLAYER_PLAY });
  };

  const playTrack = (index: number) => {
    dispatch({ type: PlayerActionTypes.PLAYER_PLAY_TRACK, payload: index });
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
      seekTo(audioElm.current.currentTime + seconds);
    },
    [seekTo]
  );

  const seekToRelative = useCallback(
    (ratio: number) => {
      seekTo((audioElm.current.duration || currentTrackDuration) * ratio);
    },
    [currentTrackDuration, seekTo]
  );

  const replay = useCallback(() => {
    seekBy(-5);
  }, [seekBy]);

  const forward = useCallback(() => {
    seekBy(30);
  }, [seekBy]);

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
      payload: boundedVolume(audioElm.current.volume + 0.05)
    });
  }, [boundedVolume]);

  const volumeDown = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_VOLUME,
      payload: boundedVolume(audioElm.current.volume - 0.05)
    });
  }, [boundedVolume]);

  const toggleMute = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_TOGGLE_MUTED
    });
  };

  const updateMediaSession = useCallback(() => {
    const artworkSrc = currentTrack.imageUrl || imageUrl;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.subtitle,
        ...(artworkSrc && { artwork: [{ src: artworkSrc }] })
      });
      navigator.mediaSession.setActionHandler('play', () => {
        play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        pause();
      });
      navigator.mediaSession.setActionHandler('seekto', (e) => {
        seekTo(e.seekTime);
      });
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        replay();
      });
      navigator.mediaSession.setActionHandler('seekforward', () => {
        forward();
      });

      if (tracks.length > 1) {
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          previousTrack();
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
          nextTrack();
        });
      }
    }
  }, [
    currentTrack.imageUrl,
    currentTrack.subtitle,
    currentTrack.title,
    forward,
    imageUrl,
    replay,
    seekTo,
    tracks.length
  ]);

  const playerContextValue = useMemo(
    () => ({
      audioElm: audioElm.current,
      imageUrl,
      state,
      dispatch,
      play,
      playTrack,
      pause,
      togglePlayPause,
      toggleMute,
      seekTo,
      seekBy,
      replay,
      forward,
      seekToRelative,
      setTrack,
      previousTrack,
      nextTrack
    }),
    [audioElm, forward, imageUrl, replay, seekBy, seekTo, seekToRelative, state]
  );

  const startPlaying = useCallback(() => {
    audioElm.current.play().then(() => {
      updateMediaSession();
    });
  }, [updateMediaSession]);

  const pauseAudio = useCallback(() => {
    audioElm.current.pause();
  }, []);

  const loadAudio = (src: string) => {
    audioElm.current.preload = playing ? 'auto' : 'none';
    audioElm.current.src = src;
  };

  const handlePlay = useCallback(() => {
    if (!playing) {
      dispatch({ type: PlayerActionTypes.PLAYER_PLAY });
    }
  }, [playing]);

  const handlePause = useCallback(() => {
    if (!audioElm.current.ended) {
      dispatch({ type: PlayerActionTypes.PLAYER_PAUSE });
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    // When audio data loads, update duration and current time, then start
    // playing if we were playing before.
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_DURATION,
      payload: audioElm.current.duration
    });

    if (playing) {
      startPlaying();
    }
  }, [playing, startPlaying]);

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
          audioElm.current.playbackRate = 3 - audioElm.current.playbackRate;
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
        case 'Equal':
          volumeUp();
          break;
        case 'Minus':
          volumeDown();
          break;
        default:
          break;
      }
    },
    [audioElm, playing, seekBy, seekTo, seekToRelative, volumeDown, volumeUp]
  );

  useEffect(() => {
    // Initialize audio element.
    if (!audioElm.current) {
      audioElm.current = new Audio();
    }

    // Setup event handlers on audio element.
    audioElm.current.addEventListener('play', handlePlay);
    audioElm.current.addEventListener('pause', handlePause);
    audioElm.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElm.current.addEventListener('ended', handleEnded);

    window.addEventListener('keydown', handleHotkey);

    return () => {
      // Cleanup event handlers between dependency changes.
      audioElm.current.removeEventListener('play', handlePlay);
      audioElm.current.removeEventListener('pause', handlePause);
      audioElm.current.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadata
      );
      audioElm.current.removeEventListener('ended', handleEnded);

      window.removeEventListener('keydown', handleHotkey);
    };
  }, [
    handleEnded,
    handleHotkey,
    handleLoadedMetadata,
    handlePause,
    handlePlay
  ]);

  useEffect(() => {
    if (!playing) {
      pauseAudio();
    } else {
      startPlaying();
    }
  }, [pauseAudio, playing, startPlaying]);

  useEffect(() => {
    audioElm.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    audioElm.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    audioElm.current.currentTime = currentTime;
  }, [currentTime]);

  useEffect(() => {
    loadAudio(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(
    () => () => {
      // Pause audio when unmounting.
      pauseAudio();
    },
    [pauseAudio]
  );

  return (
    audioElm && (
      <PlayerContext.Provider value={playerContextValue}>
        {children}
      </PlayerContext.Provider>
    )
  );
};

export default Player;
