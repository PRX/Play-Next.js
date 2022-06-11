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
  const { playing, currentTrackIndex, currentTime } = state;
  const playerContextValue = useMemo(
    () => ({
      audioElm,
      imageUrl,
      state,
      dispatch
    }),
    [audioElm, imageUrl, state]
  );
  const currentTrack = tracks[currentTrackIndex];
  const isLastTrack = currentTrackIndex === tracks.length - 1;
  const { url } = currentTrack;
  // variable for the current timestamp to scrub position?

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

    if (playing) {
      audioElm.play();
    }
  }, [audioElm, playing]);

  const handleEnded = useCallback(() => {
    if (!isLastTrack) {
      dispatch({ type: PlayerActionTypes.PLAYER_NEXT_TRACK });
    }
  }, [isLastTrack]);

  useEffect(() => {
    // Setup event handlers on audio element.
    audioElm?.addEventListener('play', handlePlay);
    audioElm?.addEventListener('pause', handlePause);
    audioElm?.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElm?.addEventListener('ended', handleEnded);

    return () => {
      // Cleanup event handlers between dependency changes.
      audioElm?.removeEventListener('play', handlePlay);
      audioElm?.removeEventListener('pause', handlePause);
      audioElm?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElm?.removeEventListener('ended', handleEnded);
    };
  }, [audioElm, handleLoadedMetadata, handlePause, handlePlay, handleEnded]);

  useEffect(() => {
    if (!playing) {
      audioElm?.pause();
    } else {
      audioElm?.play();
    }
  }, [audioElm, playing]);

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
