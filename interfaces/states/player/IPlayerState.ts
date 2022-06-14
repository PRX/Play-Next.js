/**
 * @file IPlayerState.ts
 * Define state interface used by player.
 */

import type { IAudioData } from '@interfaces/data';

export interface IPlayerState {
  /**
   * Boolean to play or pause track playback.
   */
  playing: boolean;

  /**
   * Current time played.
   */
  currentTime: number;

  /**
   * Holds the currently playing audio data.
   */
  currentTrackIndex: number;

  /**
   * Holds all the audio data that can be played.
   */
  tracks: IAudioData[];

  /**
   * Current volume of the player as a value between 0 and 1.
   */
  volume: number;

  /**
   * Boolean to mute player.
   */
  muted: boolean;
}
