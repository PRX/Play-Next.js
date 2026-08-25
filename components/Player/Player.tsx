/**
 * @file Player.tsx
 * Higher order component for Audio Player
 */

import type React from 'react';
import type { IMediaData } from '@interfaces/data';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  playerInitialState,
  playerStateReducer
} from '@states/player/Player.reducer';
import { PlayerActionTypes } from '@states/player/Player.actions';
import PlayerContext from '@contexts/PlayerContext';
import convertDurationToSeconds from '@lib/convert/string/convertDurationToSeconds';

export interface IPlayerProps extends React.PropsWithChildren<{}> {
  media: IMediaData | IMediaData[];
  startIndex?: number;
  imageUrl?: string;
}

export interface KeyboardEventWithTarget extends KeyboardEvent {
  target: HTMLElement;
}

const Player: React.FC<IPlayerProps> = ({
  media,
  startIndex,
  imageUrl,
  children
}) => {
  const initialTracks = useMemo(
    () => (media && (Array.isArray(media) ? media : [media])) || [],
    [media]
  );
  const el = useRef<HTMLMediaElement | null>(null);
  const [state, dispatch] = useReducer(playerStateReducer, {
    ...playerInitialState,
    tracks: initialTracks,
    ...(startIndex != null && { currentTrackIndex: startIndex })
  });
  const {
    tracks,
    playing,
    currentTrackIndex,
    currentTime,
    muted,
    volume,
    playbackRate
  } = state;
  const currentTrack = tracks[currentTrackIndex];
  const isLastTrack = currentTrackIndex === tracks.length - 1;
  const {
    guid,
    sources,
    hasAudioSourceAt = false,
    hasVideoSourceAt = false,
    previewUrl,
    transcripts,
    duration
  } = (currentTrack || {}) as IMediaData;
  const hasVideo = hasVideoSourceAt !== false;
  const audioSource =
    hasAudioSourceAt !== false ? sources?.[hasAudioSourceAt] : null;
  const useAudioElement = !hasVideo && !!audioSource;
  const currentTrackDurationSeconds = useMemo(
    () => convertDurationToSeconds(duration),
    [duration]
  );
  const transcript = transcripts?.find(
    (t) => !!['vtt', 'srt', 'x-subrip', 'json'].find((n) => t.type.includes(n))
  );

  const boundedTime = useCallback(
    (time: number) =>
      Math.min(
        Math.max(0.00001, time),
        el.current?.duration || currentTrackDurationSeconds
      ),
    [currentTrackDurationSeconds]
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
      seekTo((el.current?.currentTime || currentTime) + seconds);
    },
    [el, seekTo, currentTime]
  );

  const seekToRelative = useCallback(
    (ratio: number) => {
      seekTo((el.current.duration || currentTrackDurationSeconds) * ratio);
    },
    [currentTrackDurationSeconds, seekTo]
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

  const setTracks = (newTracks: IMediaData[]) => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_TRACKS,
      payload: newTracks
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
      payload: boundedVolume(el.current.volume + 0.05)
    });
  }, [boundedVolume]);

  const volumeDown = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_VOLUME,
      payload: boundedVolume(el.current.volume - 0.05)
    });
  }, [boundedVolume]);

  const setVolume = useCallback(
    (newVolume: number) => {
      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_VOLUME,
        payload: boundedVolume(newVolume)
      });
    },
    [boundedVolume]
  );

  const mute = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_MUTE
    });
  };

  const unmute = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UNMUTE
    });
  };

  const toggleMute = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_TOGGLE_MUTED
    });
  };

  const setPlaybackRate = (rate: number) => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_PLAYBACK_RATE,
      payload: rate
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
    currentTrack?.imageUrl,
    currentTrack?.subtitle,
    currentTrack?.title,
    forward,
    imageUrl,
    replay,
    seekTo,
    tracks.length
  ]);

  const playerContextValue = useMemo(
    () => ({
      el,
      imageUrl,
      state,
      dispatch,
      play,
      playTrack,
      pause,
      togglePlayPause,
      mute,
      unmute,
      toggleMute,
      seekTo,
      seekBy,
      replay,
      forward,
      seekToRelative,
      setTrack,
      setTracks,
      previousTrack,
      nextTrack,
      setPlaybackRate,
      setVolume
    }),
    [
      forward,
      imageUrl,
      replay,
      seekBy,
      seekTo,
      seekToRelative,
      setVolume,
      state
    ]
  );

  const startPlaying = useCallback(() => {
    el.current
      ?.play()
      .then(() => {
        updateMediaSession();
      })
      .catch((e) => {
        if (e.name !== 'AbortError') {
          throw e; // Rethrow actual critical errors
        }
      });
  }, [updateMediaSession]);

  const pauseAudio = useCallback(() => {
    el.current?.pause();
  }, []);

  const handlePlay = useCallback(() => {
    if (!playing) {
      dispatch({ type: PlayerActionTypes.PLAYER_PLAY });
    }
  }, [playing]);

  const handlePause = useCallback(() => {
    if (!el.current.ended) {
      dispatch({ type: PlayerActionTypes.PLAYER_PAUSE });
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (playing) {
      startPlaying();
    }
  }, [playing, startPlaying]);

  const handleEnded = useCallback(() => {
    if (!isLastTrack) {
      nextTrack();
    }
  }, [isLastTrack]);

  const handleHotkey = useCallback(
    (event: KeyboardEventWithTarget) => {
      const key = event.code || event.key;
      const hasModifier =
        event.altKey || event.shiftKey || event.ctrlKey || event.metaKey;

      // Bail if modifier key is pressed to allow browser shortcuts to function.
      if (hasModifier) return;

      switch (key) {
        case 'KeyS':
          setPlaybackRate(playbackRate === 1 ? 2 : 1); // Toggle rate between 1 or 2.
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'Space':
          if (!['A', 'BUTTON'].includes(event.target.nodeName)) {
            togglePlayPause();
          }
          break;
        case 'KeyK':
          togglePlayPause();
          break;
        case 'KeyJ':
          seekBy(-5);
          break;
        case 'KeyL':
          seekBy(30);
          break;
        case 'ArrowLeft':
          if (!['INPUT'].includes(event.target.nodeName)) {
            seekBy(-5);
          }
          break;
        case 'ArrowRight':
          if (!['INPUT'].includes(event.target.nodeName)) {
            seekBy(5);
          }
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
    [
      playbackRate,
      playing,
      seekBy,
      seekTo,
      seekToRelative,
      volumeDown,
      volumeUp
    ]
  );

  useEffect(() => {
    const audioElmTemp = el.current;

    // Setup event handlers on audio element.
    audioElmTemp?.addEventListener('play', handlePlay);
    audioElmTemp?.addEventListener('pause', handlePause);
    audioElmTemp?.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElmTemp?.addEventListener('ended', handleEnded);

    window.addEventListener('keydown', handleHotkey);

    return () => {
      // Cleanup event handlers between dependency changes.
      audioElmTemp?.removeEventListener('play', handlePlay);
      audioElmTemp?.removeEventListener('pause', handlePause);
      audioElmTemp?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElmTemp?.removeEventListener('ended', handleEnded);

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
    if (!el.current) return;
    el.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (!el.current) return;
    el.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!el.current) return;
    el.current.currentTime = currentTime;
  }, [currentTime]);

  useEffect(() => {
    if (!el.current) return;
    el.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(
    () => () => {
      // Pause audio when unmounting.
      pauseAudio();
    },
    [pauseAudio]
  );

  useEffect(() => {
    setTracks(initialTracks);
  }, [initialTracks]);

  useEffect(() => {
    seekTo(0);
  }, [guid, seekTo]);

  return (
    <PlayerContext.Provider value={playerContextValue}>
      {useAudioElement && (
        /* eslint-disable-next-line jsx-a11y/media-has-caption */
        <audio preload={playing ? 'auto' : 'none'} ref={el} key={guid}>
          <source src={previewUrl || audioSource.url} type={audioSource.type} />
          {transcript && (
            <track
              kind="captions"
              src={`/api/proxy/transcript/vtt?u=${transcript.url}&cb=${duration}`}
              default
              key={transcript.url}
            />
          )}
        </audio>
      )}
      {children}
    </PlayerContext.Provider>
  );
};

export default Player;
