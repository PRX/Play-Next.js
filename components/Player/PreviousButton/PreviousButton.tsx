/**
 * @file PreviousButton.tsx
 * Previous button component to skip to previous track in playlist.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import IconButton from '@components/IconButton';
import PreviousIcon from '@svg/icons/Previous.svg';

export interface IPreviousButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PreviousButton: React.FC<IPreviousButtonProps> = ({ ...props }) => {
  const { previousTrack } = useContext(PlayerContext);

  const handleClick = () => {
    previousTrack();
  };

  return (
    <IconButton {...props} type="button" onClick={handleClick}>
      <PreviousIcon aria-label="Previous Track" />
    </IconButton>
  );
};

export default PreviousButton;
