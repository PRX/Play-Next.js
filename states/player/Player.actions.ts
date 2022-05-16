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
  'PLAYER_UPDATE_SEEKING' = '[Player] UPDATE_SEEKING',
  'PLAYER_UPDATE_PROGRESS_TO_SEEKING' = '[Player] UPDATE_PROGRESS_TO_SEEKING',
  'PLAYER_UPDATE_DURATION' = '[Player] UPDATE_DURATION',
  'PLAYER_SHOW_EMBED_CODE' = '[Player] SHOW_EMBED_CODE',
  'PLAYER_HIDE_EMBED_CODE' = '[Player] HIDE_EMBED_CODE',
  'PLAYER_TOGGLE_EMBED_CODE_SHOWN' = '[Player] TOGGLE_EMBED_CODE_SHOW',
  'PLAYER_UPDATE_STUCK' = '{Player] UPDATE_STUCK'
}

export type PlayerAction = {
  type: PlayerActionTypes;
  payload?: any;
};
