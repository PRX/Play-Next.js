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
  currentTrackIndex: 0,
  tracks: null
};

export const playerStateReducer = (
  state: IPlayerState,
  action: PlayerAction
): IPlayerState => {
  const { playing, currentTrackIndex, tracks } = state;

  switch (action.type) {
    case ActionTypes.PLAYER_PLAY:
      return { ...state, playing: true };

    case ActionTypes.PLAYER_PAUSE:
      return { ...state, playing: false };

    case ActionTypes.PLAYER_TOGGLE_PLAYING:
      return { ...state, playing: !playing };

    case ActionTypes.PLAYER_UPDATE_TRACKS:
      return { ...state, tracks: action.payload };

    case ActionTypes.PLAYER_UPDATE_CURRENT_TRACK_INDEX:
      return { ...state, currentTrackIndex: action.payload };

    case ActionTypes.PLAYER_NEXT_TRACK:
      return {
        ...state,
        currentTrackIndex: Math.min(currentTrackIndex + 1, tracks.length - 1)
      };

    case ActionTypes.PLAYER_PREVIOUS_TRACK:
      return {
        ...state,
        currentTrackIndex: Math.max(currentTrackIndex - 1, 0)
      };

    default:
      return state;
  }
};
