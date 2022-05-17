/**
 * @file PlayButton.tsx
 * Play button component to toggle playing state of player.
 */

import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import PauseIcon from '@svg/icons/Pause.svg';
import PlayArrowIcon from '@svg/icons/PlayArrow.svg';

const PlayButton = () => {
  const { state, dispatch } = useContext(PlayerContext);
  const { playing } = state;

  const handleClick = () => {
    dispatch({ type: PlayerActionTypes.PLAYER_TOGGLE_PLAYING });
  };

  return (
    <button type="button" onClick={handleClick}>
      {!playing ? <PlayArrowIcon /> : <PauseIcon />}
    </button>
  );
};

export default PlayButton;
