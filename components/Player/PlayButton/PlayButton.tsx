/**
 * @file PlayButton.tsx
 * Play button component to toggle playing state of player.
 */

import React, { useContext } from 'react';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import PlayArrowIcon from '@svg/icons/PlayArrow.svg';
import PauseIcon from '@svg/icons/Pause.svg';
import styles from './PlayButton.module.scss';

export interface IPlayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PlayButton: React.FC<IPlayButtonProps> = ({ className, ...props }) => {
  const { state, dispatch } = useContext(PlayerContext);
  const { playing } = state;

  const handleClick = () => {
    dispatch({ type: PlayerActionTypes.PLAYER_TOGGLE_PLAYING });
  };

  return (
    <button
      className={clsx(styles.root, styles.iconButton, className)}
      {...props}
      type="button"
      onClick={handleClick}
    >
      {!playing ? <PlayArrowIcon /> : <PauseIcon />}
    </button>
  );
};

export default PlayButton;
