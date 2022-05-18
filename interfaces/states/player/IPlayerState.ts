/**
 * @file IPlayerState.ts
 * Define state interface used by player.
 */

import { IAudioData } from '@interfaces/data/IAudioData';

export interface IPlayerState {
  /**
   * Boolean to play or pause track playback.
   */
  playing: boolean;

  /**
   * Holds the currently playing audio data.
   */
  currentTrackIndex: number;

  /**
   * Holds all the audio data that can be played.
   */
  tracks: IAudioData[];
}
