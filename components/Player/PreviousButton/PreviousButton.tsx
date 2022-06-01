/**
 * @file PreviousButton.tsx
 * Previous button component to skip to previous track in playlist.
 */

import React, { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import PreviousIcon from '@svg/icons/Previous.svg';

export interface INextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PreviousButton: React.FC<INextButtonProps> = ({ ...props }) => {
  const { state, dispatch } = useContext(PlayerContext);
  const { currentTrackIndex } = state;

  //  Change to correct player action
  const handleClick = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TRACK_INDEX,
      payload: currentTrackIndex - 1
    });
  };
  // add conditional to only show next and previous track buttons when a playlist is present
  return (
    <button {...props} type="button" onClick={handleClick}>
      <PreviousIcon aria-label="Previous Track" />
    </button>
  );
};

export default PreviousButton;
