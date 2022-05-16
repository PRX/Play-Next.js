/**
 * @file Player.tsx
 * Higher order component for Audio Player
 */

import React, { useEffect, useMemo, useReducer, useState } from 'react';
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

  useEffect(() => {
    setAudioElm(new Audio(url));
  }, [setAudioElm, url]);

  useEffect(() => {
    audioElm?.addEventListener('play', () =>
      dispatch({ type: PlayerActionTypes.PLAYER_PLAY })
    );
    audioElm?.addEventListener('pause', () =>
      dispatch({ type: PlayerActionTypes.PLAYER_PAUSE })
    );
  }, [audioElm]);

  useEffect(() => {
    if (!playing) {
      audioElm?.pause();
    } else {
      audioElm?.play();
    }
  }, [audioElm, playing]);

  useEffect(
    () => () => {
      // Pause and clean up on unmount
      audioElm?.pause();
    },
    [audioElm]
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
