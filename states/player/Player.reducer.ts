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
  volume: 0.8,
  muted: false,
  duration: null,
  seeking: null,
  played: null,
  playedSeconds: null,
  loaded: null,
  loadedSeconds: null
};

export const playerStateReducer = (
  state: IPlayerState,
  action: PlayerAction
): IPlayerState => {
  const { playing, muted, seeking } = state;

  switch (action.type) {
    case ActionTypes.PLAYER_PLAY:
      return { ...state, playing: true };

    case ActionTypes.PLAYER_PAUSE:
      return { ...state, playing: false };

    case ActionTypes.PLAYER_TOGGLE_PLAYING:
      return { ...state, playing: !playing };

    case ActionTypes.PLAYER_MUTE:
      return { ...state, muted: true };

    case ActionTypes.PLAYER_UNMUTE:
      return { ...state, muted: false };

    case ActionTypes.PLAYER_TOGGLE_MUTED:
      return { ...state, muted: !muted };

    case ActionTypes.PLAYER_UPDATE_VOLUME:
      return { ...state, volume: action.payload };

    case ActionTypes.PLAYER_UPDATE_PROGRESS:
      return { ...state, ...action.payload };

    case ActionTypes.PLAYER_UPDATE_SEEKING:
      return { ...state, seeking: action.payload };

    case ActionTypes.PLAYER_UPDATE_PROGRESS_TO_SEEKING:
      return {
        ...state,
        played: seeking,
        seeking: null
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
