/**
 * @file ReplayButton.tsx
 * Jump 5 seconds back in currently playing track.
 */

import React, { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import IconButton from '@components/IconButton';
import ReplayIcon from '@svg/icons/Replay.svg';

export interface IReplayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ReplayButton: React.FC<IReplayButtonProps> = ({ ...props }) => {
  const { audioElm, dispatch } = useContext(PlayerContext);

  const handleClick = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TIME,
      payload: audioElm.currentTime - 5
    });
  };

  // have to think about what to do here
  return (
    <IconButton {...props} type="button" onClick={handleClick}>
      <ReplayIcon />
    </IconButton>
  );
};

export default ReplayButton;
