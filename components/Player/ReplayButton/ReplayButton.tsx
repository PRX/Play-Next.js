/**
 * @file ReplayButton.tsx
 * Jump 5 seconds back in currently playing track.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import IconButton from '@components/IconButton';
import ReplayIcon from '@svg/icons/Replay.svg';

export interface IReplayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ReplayButton: React.FC<IReplayButtonProps> = ({ ...props }) => {
  const { replay } = useContext(PlayerContext);

  const handleClick = () => {
    replay();
  };

  return (
    <IconButton {...props} type="button" onClick={handleClick}>
      <ReplayIcon aria-label="Replay last 5 seconds" />
    </IconButton>
  );
};

export default ReplayButton;
