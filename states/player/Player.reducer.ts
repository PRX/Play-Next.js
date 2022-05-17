/**
 * @file Player.reducer.ts
 * Defines reducer for handling player state actions.
 */

import { IPlayerState } from '@interfaces/states/player';
import {
  PlayerActionTypes as ActionTypes,
  PlayerAction
} from './Player.actions';

export const playerInitialState: IPlayerState = {
  playing: false,
  currentTrack: null
};

export const playerStateReducer = (
  state: IPlayerState,
  action: PlayerAction
): IPlayerState => {
  const { playing } = state;

  switch (action.type) {
    case ActionTypes.PLAYER_PLAY:
      return { ...state, playing: true };

    case ActionTypes.PLAYER_PAUSE:
      return { ...state, playing: false };

    case ActionTypes.PLAYER_TOGGLE_PLAYING:
      return { ...state, playing: !playing };

    case ActionTypes.PLAYER_UPDATE_CURRENT_TRACK:
      return { ...state, currentTrack: action.payload };

    default:
      return state;
  }
};
