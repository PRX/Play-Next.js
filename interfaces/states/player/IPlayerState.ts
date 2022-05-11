/**
 * @file IPlayerState.ts
 * Define state interface used by player.
 */

import { IAudioData } from '@interfaces/data/IAudioData';

export interface IPlayerState {
  /**
   * Holds the currently playing audio data.
   */
  currentTrack: IAudioData;

  /**
   * Holds all the audio data that can be played.
   */
  tracks?: IAudioData[];

  /**
   * Boolean to play or pause track playback.
   */
  playing: boolean;
}
