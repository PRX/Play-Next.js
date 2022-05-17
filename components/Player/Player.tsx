/**
 * @file Player.tsx
 * Higher order component for Audio Player
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react';
import { IAudioData } from '@interfaces/data';
import {
  playerInitialState,
  playerStateReducer
} from '@states/player/Player.reducer';
import { PlayerActionTypes } from '@states/player/Player.actions';
import PlayerContext from '@contexts/PlayerContext';

export interface IPlayerProps extends React.PropsWithChildren<{}> {
  data: IAudioData;
}

const Player: React.FC<IPlayerProps> = ({ data, children }) => {
  const { url } = data;
  const [audioElm, setAudioElm] = useState(null as HTMLAudioElement);
  const [state, dispatch] = useReducer(playerStateReducer, playerInitialState);
  const playerContextValue = useMemo(
    () => ({
      state,
      dispatch
    }),
    [state]
  );
  const { playing } = state;

  const handlePlay = useCallback(() => {
    dispatch({ type: PlayerActionTypes.PLAYER_PLAY });
  }, []);

  const handlePause = useCallback(() => {
    dispatch({ type: PlayerActionTypes.PLAYER_PAUSE });
  }, []);

  const handleDurationChange = useCallback(() => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_DURATION,
      payload: audioElm?.duration
    });
  }, [audioElm?.duration]);

  const handleLoadedData = useCallback(() => {
    // When audio data loads, start playing if we were playing before.
    if (playing) {
      audioElm.play();
    }
  }, [audioElm, playing]);

  useEffect(() => {
    // Setup event handlers on audio element.
    audioElm?.addEventListener('play', handlePlay);
    audioElm?.addEventListener('pause', handlePause);
    audioElm?.addEventListener('durationchange', handleDurationChange);
    audioElm?.addEventListener('loadeddata', handleLoadedData);

    return () => {
      // Cleanup event handlers between dependency changes.
      audioElm?.removeEventListener('play', handlePlay);
      audioElm?.removeEventListener('pause', handlePause);
      audioElm?.removeEventListener('durationchange', handleDurationChange);
      audioElm?.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [
    audioElm,
    handleDurationChange,
    handleLoadedData,
    handlePause,
    handlePlay
  ]);

  useEffect(() => {
    if (!playing) {
      audioElm?.pause();
    } else {
      audioElm?.play();
    }
  }, [audioElm, playing, url]);

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
