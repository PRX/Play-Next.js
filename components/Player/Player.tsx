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
  const playerContextValue = useMemo(
    () => ({
      audioElm,
      imageUrl,
      state,
      dispatch
    }),
    [state, imageUrl, audioElm]
  );
  const { playing, currentTrackIndex, currentTime } = state;
  const currentTrack = tracks[currentTrackIndex];
  const { url } = currentTrack;
  // variable for the current timestamp to scrub position?

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

  useEffect(() => {
    if (audioElm) {
      audioElm.currentTime = currentTime;
    }
  }, [audioElm, currentTime]);

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
