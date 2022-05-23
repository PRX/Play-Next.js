/**
 * @file PlayerVolume.reducer.ts
 * Defines reducer for handling player volume actions.
 */

import { IPlayerVolumeState } from '@interfaces/states/player';
import {
  PlayerActionTypes as ActionTypes,
  PlayerAction
} from './Player.actions';

export const playerVolumeInitialState: IPlayerVolumeState = {
  volume: 0.8,
  muted: false
};

export const playerVolumeStateReducer = (
  state: IPlayerVolumeState,
  action: PlayerAction
): IPlayerVolumeState => {
  const { muted } = state;

  switch (action.type) {
    case ActionTypes.PLAYER_MUTE:
      return { ...state, muted: true };

    case ActionTypes.PLAYER_UNMUTE:
      return { ...state, muted: false };

    case ActionTypes.PLAYER_TOGGLE_MUTED:
      return { ...state, muted: !muted };

    case ActionTypes.PLAYER_UPDATE_VOLUME:
      return { ...state, volume: action.payload };

    default:
      return state;
  }
};
