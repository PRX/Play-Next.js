/**
 * @file ForwardButton.tsx
 * Jump forward 30 seconds in the currently playing track.
 *
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import IconButton from '@components/IconButton';
import ForwardIcon from '@svg/icons/Forward.svg';

export interface IForwardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ForwardButton: React.FC<IForwardButtonProps> = ({ ...props }) => {
  const { forward } = useContext(PlayerContext);

  const handleClick = () => {
    forward();
  };

  return (
    <IconButton
      title="Skip Ahead 30 Seconds (l)"
      {...props}
      type="button"
      onClick={handleClick}
    >
      <ForwardIcon />
    </IconButton>
  );
};

export default ForwardButton;
