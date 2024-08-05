/**
 * @file PlayButton.tsx
 * Play button component to toggle playing state of player.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import IconButton from '@components/IconButton';
import PlayArrowIcon from '@svg/icons/PlayArrow.svg';
import PauseIcon from '@svg/icons/Pause.svg';
import styles from './PlayButton.module.scss';

export interface IPlayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PlayButton: React.FC<IPlayButtonProps> = ({ className, ...props }) => {
  const { state, togglePlayPause } = useContext(PlayerContext);
  const { playing } = state;

  const handleClick = () => {
    togglePlayPause();
  };

  return (
    <IconButton
      className={styles.root}
      title={`${!playing ? 'Play' : 'Pause'} (k / space)`}
      {...props}
      type="button"
      onClick={handleClick}
    >
      {!playing ? <PlayArrowIcon /> : <PauseIcon />}
    </IconButton>
  );
};

export default PlayButton;
