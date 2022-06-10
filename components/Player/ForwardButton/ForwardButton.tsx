/**
 * @file ForwardButton.tsx
 * Jump forward 30 seconds in the currently playing track.
 *
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import IconButton from '@components/IconButton';
import ForwardIcon from '@svg/icons/Forward.svg';

export interface IForwardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ForwardButton: React.FC<IForwardButtonProps> = ({ ...props }) => {
  const { audioElm, dispatch } = useContext(PlayerContext);

  const handleClick = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TIME,
      payload: Math.min(audioElm.currentTime + 30, audioElm.duration)
    });
  };

  return (
    <IconButton {...props} type="button" onClick={handleClick}>
      <ForwardIcon aria-label="Skip ahead 30 seconds" />
    </IconButton>
  );
};

export default ForwardButton;
