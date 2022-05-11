/**
 * @file PlayButton.tsx
 * Play button component to toggle playing state of player.
 */

import PlayerContext from '@contexts/PlayerContext';
import { PlayerActionTypes } from '@states/player/Player.actions';
import { useContext } from 'react';

const PlayButton = () => {
  const { state, dispatch } = useContext(PlayerContext);
  const { playing } = state;

  const handleClick = () => {
    dispatch({ type: PlayerActionTypes.PLAYER_TOGGLE_PLAYING });
  };

  return (
    <button type="button" onClick={handleClick}>
      {!playing ? 'Play' : 'Pause'}
    </button>
  );
};

export default PlayButton;
