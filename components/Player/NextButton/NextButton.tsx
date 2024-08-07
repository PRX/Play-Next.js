/**
 * @file NextButton.tsx
 * Next button component to skip to next track in playlist.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import IconButton from '@components/IconButton';
import NextIcon from '@svg/icons/Next.svg';

export interface INextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const NextButton: React.FC<INextButtonProps> = (props) => {
  const { nextTrack } = useContext(PlayerContext);

  const handleClick = () => {
    nextTrack();
  };

  return (
    <IconButton
      title="Next Episode (])"
      {...props}
      type="button"
      onClick={handleClick}
    >
      <NextIcon />
    </IconButton>
  );
};

export default NextButton;
