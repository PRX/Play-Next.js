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
    <IconButton {...props} type="button" onClick={handleClick}>
      <ForwardIcon aria-label="Skip ahead 30 seconds" />
    </IconButton>
  );
};

export default ForwardButton;
