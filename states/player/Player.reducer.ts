/**
 * @file Player.reducer.ts
 * Defines reducer for handling player state actions.
 */

import { IPlayerState } from '@interfaces/states/player';
import {
  PlayerActionTypes as ActionTypes,
  IPlayerAction
} from './Player.actions';

export const playerInitialState: IPlayerState = {
  playing: false,
  playbackRate: 1,
  currentTrack: null,
  tracks: [],
  currentTime: null,
  muted: false,
  volume: 0.8
};

export const playerStateReducer = (
  state: IPlayerState,
  action: IPlayerAction
): IPlayerState => {
  const { playing, currentTrack, tracks, muted } = state;
  const currentTrackIndex = tracks.findIndex(
    ({ guid }) => guid === currentTrack?.guid
  );

  switch (action.type) {
    case ActionTypes.PLAYER_PLAY:
      return { ...state, playing: true };

    case ActionTypes.PLAYER_PAUSE:
      return { ...state, playing: false };

    case ActionTypes.PLAYER_TOGGLE_PLAYING:
      return { ...state, playing: !playing };

    case ActionTypes.PLAYER_UPDATE_TRACKS:
      return {
        ...state,
        tracks: action.payload
      };

    case ActionTypes.PLAYER_UPDATE_CURRENT_TRACK_INDEX:
      return {
        ...state,
        currentTrack:
          tracks[Math.max(0, Math.min(action.payload, tracks.length - 1))]
      };

    case ActionTypes.PLAYER_PLAY_EPISODE:
      return {
        ...state,
        currentTrack:
          tracks.find(({ guid }) => guid === action.payload) || tracks[0]
      };

    case ActionTypes.PLAYER_PLAY_TRACK:
      return {
        ...state,
        currentTime: 0,
        currentTrack:
          tracks[Math.max(0, Math.min(action.payload, tracks.length - 1))],
        playing: true
      };

    case ActionTypes.PLAYER_NEXT_TRACK:
      return {
        ...state,
        currentTrack: tracks[Math.min(currentTrackIndex + 1, tracks.length - 1)]
      };

    case ActionTypes.PLAYER_PREVIOUS_TRACK:
      return {
        ...state,
        currentTrack: tracks[Math.max(currentTrackIndex - 1, 0)]
      };

    case ActionTypes.PLAYER_UPDATE_CURRENT_TIME:
      return { ...state, currentTime: action.payload };

    case ActionTypes.PLAYER_MUTE:
      return { ...state, muted: true };

    case ActionTypes.PLAYER_UNMUTE:
      return { ...state, muted: false };

    case ActionTypes.PLAYER_TOGGLE_MUTED:
      return { ...state, muted: !muted };

    case ActionTypes.PLAYER_UPDATE_VOLUME:
      return {
        ...state,
        volume: action.payload,
        muted: action.payload === 0
      };

    case ActionTypes.PLAYER_UPDATE_PLAYBACK_RATE:
      return { ...state, playbackRate: action.payload };

    default:
      return state;
  }
};
