/**
 * @file Player.actions.ts
 * Defines state change actions for audio player.
 */

export enum PlayerActionTypes {
  'PLAYER_PLAY' = '[Player] PLAY',
  'PLAYER_PAUSE' = '[Player] PAUSE',
  'PLAYER_TOGGLE_PLAYING' = '[Player] TOGGLE_PLAYING',
  'PLAYER_MUTE' = '[Player] MUTE',
  'PLAYER_UNMUTE' = '[Player] UNMUTE',
  'PLAYER_TOGGLE_MUTED' = '[Player] TOGGLE_MUTED',
  'PLAYER_UPDATE_VOLUME' = '[Player] SET_VOLUME',
  'PLAYER_UPDATE_PROGRESS' = '[Player] UPDATE_PROGRESS',
  'PLAYER_UPDATE_SCRUB_POSITION' = '[Player] UPDATE_SEEKING',
  'PLAYER_UPDATE_PROGRESS_TO_SCRUB_POSITION' = '[Player] UPDATE_PROGRESS_TO_SEEKING',
  'PLAYER_UPDATE_DURATION' = '[Player] UPDATE_DURATION',
  'PLAYER_UPDATE_TRACKS' = '[Player] UPDATE_TRACKS',
  'PLAYER_UPDATE_CURRENT_TRACK_INDEX' = '[Player] UPDATE_CURRENT_TRACK_INDEX',
  'PLAYER_PLAY_TRACK' = '[PLAYER] PLAY_TRACK',
  'PLAYER_NEXT_TRACK' = '[Player] NEXT_TRACK',
  'PLAYER_PREVIOUS_TRACK' = '[Player] PREVIOUS_TRACK',
  'PLAYER_UPDATE_CURRENT_TIME' = '[Player] UPDATE_CURRENT_TIME'
}

export interface IPlayerAction {
  type: PlayerActionTypes;
  payload?: any;
}
