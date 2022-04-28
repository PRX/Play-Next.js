/**
 * @file IPlayerState.ts
 * Define state interface used by player.
 */

import { IProgressState } from './IProgressState';

export interface IPlayerState extends IProgressState {
  /**
   * Boolean to play or pause track playback.
   */
  playing: boolean;

  /**
   * Current volume of the player as a value between 0 and 1.
   */
  volume: number;

  /**
   * Boolean to mute player.
   */
  muted: boolean;

  /**
   * Duration of the track in seconds.
   */
  duration: number;

  /**
   * Position user wants to change playback to as a value between 0 and 1.
   */
  seeking: number;
}
