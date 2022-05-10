/**
 * @file Player.tsx
 * Higher order component used to establish audio player state for children UI components.
 */

import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { IAudioData } from '@interfaces/data';
import { IProgressState } from '@interfaces/states/player';
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
  const [state, dispatch] = useReducer(playerStateReducer, playerInitialState);
  const stateContextValue = useMemo(() => ({ state, dispatch }), [state]);
  const { playing, muted, volume } = state;
  const playerElm = useRef(null as ReactPlayer);
  // React Player component doesn't hydrate well after SSR. This is a flag to postpone its render to the client.
  const [isCsr, setIsCsr] = useState(false);

  // Configure React Player Component.
  const playerProps: ReactPlayerProps = {
    config: {
      file: {
        forceAudio: true,
        attributes: {
          autoPlay: false
        }
      }
    },
    ref: playerElm,
    style: { display: 'none' },
    url,
    playing,
    volume,
    muted,
    progressInterval: 500,
    onPlay: () => dispatch({ type: PlayerActionTypes.PLAYER_PLAY }),
    onPause: () => dispatch({ type: PlayerActionTypes.PLAYER_PAUSE }),
    onProgress: (payload: IProgressState) => {
      console.log('Player::onProgress', payload);
      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS,
        payload
      });
    },
    onDuration: (payload: number) => {
      console.log('Player::onDuration', payload);
      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_DURATION,
        payload
      });
    }
  };

  useEffect(() => {
    // Ready to render player on the client.
    setIsCsr(true);

    return () => {
      console.log('Player unmounted.');
    };
  }, []);

  console.log('Player::render', state);

  return (
    <>
      {isCsr && <ReactPlayer {...playerProps} />}
      <PlayerContext.Provider value={stateContextValue}>
        {children}
      </PlayerContext.Provider>
    </>
  );
};

export default Player;
