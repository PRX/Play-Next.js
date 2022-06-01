/**
 * @file NextButton.tsx
 * Next button component to skip to next track in playlist.
 */

import React, { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import IconButton from '@components/IconButton';
import NextIcon from '@svg/icons/Next.svg';

export interface INextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const NextButton: React.FC<INextButtonProps> = ({ ...props }) => {
  const { state, dispatch } = useContext(PlayerContext);
  const { currentTrackIndex } = state;

  //  Change to correct player action
  const handleClick = () => {
    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_CURRENT_TRACK_INDEX,
      payload: currentTrackIndex + 1
    });
  };
  // add conditional to only show next and previous track buttons when a playlist is present
  return (
    <IconButton {...props} type="button" onClick={handleClick}>
      <NextIcon aria-label="Next Track" />
    </IconButton>
  );
};

export default NextButton;
