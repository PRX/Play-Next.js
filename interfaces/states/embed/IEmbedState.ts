/**
 * @file IEmbedState.ts
 * Define state interface used for embed page.
 */

import { IAudioData } from '@interfaces/data';

export interface IEmbedState {
  /**
   * Holds the currently playing audio data.
   */
  currentTrack: IAudioData;

  /**
   * Holds all the audio data that can be played.
   */
  tracks?: IAudioData[];

  /**
   * Flag to show share menu dialog.
   */
  shareShown: boolean;

  /**
   * Flag to show follow menu dialog.
   */
  followShown: boolean;

  /**
   * Flag to show support menu dialog.
   */
  supportShown: boolean;
}
