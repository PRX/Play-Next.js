/**
 * @file PlayButton.tsx
 * Play button component to toggle playing state of player.
 */

import React, { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import PlayArrowIcon from '@svg/icons/PlayArrow.svg';
import PauseIcon from '@svg/icons/Pause.svg';

export interface IPlayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PlayButton: React.FC<IPlayButtonProps> = ({ ...props }) => {
  const { state, dispatch } = useContext(PlayerContext);
  const { playing } = state;

  const handleClick = () => {
    dispatch({ type: PlayerActionTypes.PLAYER_TOGGLE_PLAYING });
  };

  return (
    <button {...props} type="button" onClick={handleClick}>
      {!playing ? <PlayArrowIcon /> : <PauseIcon />}
    </button>
  );
};

export default PlayButton;
