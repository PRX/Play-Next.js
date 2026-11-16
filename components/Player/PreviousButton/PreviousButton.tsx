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
  const { state, previousTrack } = useContext(PlayerContext);
  const { currentTrack, tracks } = state;
  const currentTrackIndex = tracks.findIndex(
    ({ guid }) => guid === currentTrack?.guid
  );
  const isFirstTrack = currentTrackIndex <= 0;

  const handleClick = () => {
    previousTrack();
  };

  return (
    <IconButton
      title="Play Previous Track ([)"
      {...props}
      disabled={isFirstTrack}
      type="button"
      onClick={handleClick}
    >
      <PreviousIcon />
    </IconButton>
  );
};

export default PreviousButton;
