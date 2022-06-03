/**
 * @file PreviousButton.tsx
 * Previous button component to skip to previous track in playlist.
 */

import React, { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import IconButton from '@components/IconButton';
import PreviousIcon from '@svg/icons/Previous.svg';

export interface INextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PreviousButton: React.FC<INextButtonProps> = ({ ...props }) => {
  const { dispatch } = useContext(PlayerContext);

  const handleClick = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_PREVIOUS_TRACK
    });
  };

  return (
    <IconButton {...props} type="button" onClick={handleClick}>
      <PreviousIcon aria-label="Previous Track" />
    </IconButton>
  );
};

export default PreviousButton;
