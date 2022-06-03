/**
 * @file PlayerProgress.reducer.ts
 * Defines reducer for handling player progress actions.
 */

import { IPlayerProgressState } from '@interfaces/states/player';
import {
  PlayerActionTypes as ActionTypes,
  IPlayerAction
} from './Player.actions';

export const playerProgressInitialState: IPlayerProgressState = {
  duration: 0,
  played: 0,
  playedSeconds: 0,
  loaded: 0,
  loadedSeconds: 0,
  scrubPosition: null
};

export const playerProgressStateReducer = (
  state: IPlayerProgressState,
  action: IPlayerAction
): IPlayerProgressState => {
  const { scrubPosition } = state;

  switch (action.type) {
    case ActionTypes.PLAYER_UPDATE_PROGRESS:
      return { ...state, ...action.payload };

    case ActionTypes.PLAYER_UPDATE_SCRUB_POSITION:
      return { ...state, scrubPosition: action.payload };

    case ActionTypes.PLAYER_UPDATE_PROGRESS_TO_SCRUB_POSITION:
      return {
        ...state,
        played: scrubPosition,
        scrubPosition: null
      };

    case ActionTypes.PLAYER_UPDATE_DURATION:
      return {
        ...state,
        duration: action.payload
      };

    default:
      return state;
  }
};
