/**
 * @file ForwardButton.tsx
 * Jump forward 30 seconds in the currently playing track.
 *
 */

import React, { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import IconButton from '@components/IconButton';
import ForwardIcon from '@svg/icons/Forward.svg';

export interface IForwardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ForwardButton: React.FC<IForwardButtonProps> = ({ ...props }) => {
  const { audioElm, dispatch } = useContext(PlayerContext);

  // it seems like there's no replay action type; using as placeholder. Unless I'm blind and missed it. -AM
  const handleClick = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TIME,
      payload: audioElm.currentTime + 30
    });
  };

  // have to think about what to do here
  return (
    <IconButton {...props} type="button" onClick={handleClick}>
      <ForwardIcon />
    </IconButton>
  );
};

export default ForwardButton;
