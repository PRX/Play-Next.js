/**
 * @file Player.tsx
 * Higher order component used to establish audio player state for children UI components.
 */

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { IAudioData } from '@interfaces/data';
import {
  playerInitialState,
  playerStateReducer
} from '@states/player/Player.reducer';
import { PlayerActionTypes } from '@states/player/Player.actions';
import PlayerContext from '@contexts/PlayerContext';
import { IStateContext } from '@interfaces/states/IStateContext';

export interface IPlayerProps extends React.PropsWithChildren<{}> {
  data: IAudioData;
}

const Player: React.FC<IPlayerProps> = ({ data, children }) => {
  const { url } = data;
  const [audioElm, setAudioElm] = useState(null as HTMLAudioElement);
  const [state, dispatch] = useReducer(playerStateReducer, playerInitialState);
  const stateContextValue = useMemo(
    (): IStateContext => ({ audioElm, state, dispatch }),
    [audioElm, state]
  );
  const { playing } = state;

  // TODO: Move to progress bar component.
  // const intervalRef = useRef(null);
  // const startTimer = useCallback(() => {
  //   clearInterval(intervalRef.current);

  //   intervalRef.current = setInterval(() => {
  //     if (audioElm.ended) {
  //       // TODO: Dispatch for next track.
  //     } else {
  //       // Update played progress.
  //     }
  //   }, 500);
  // }, [audioElm]);

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
    audioElm?.addEventListener('volumechange', () =>
      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_VOLUME,
        payload: audioElm.volume
      })
    );

    // TODO: Handle audio ended when there is a playlist.
    // audioElm.addEventListener('ended', () =>
    //   // TODO: Advance to next track.
    // );
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

  console.log('Player::render', state, data, audioElm);

  return (
    audioElm && (
      <PlayerContext.Provider value={stateContextValue}>
        {children}
      </PlayerContext.Provider>
    )
  );
};

export default Player;
