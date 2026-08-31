/**
 * @file IPlayerState.ts
 * Define state interface used by player.
 */

import type { IMediaData } from '@interfaces/data';

export interface IPlayerState {
  /**
   * Boolean to play or pause track playback.
   */
  playing: boolean;

  /**
   * How fast audio is played as a ratio, 1 being normal speed.
   */
  playbackRate: number;

  /**
   * Current time played.
   */
  currentTime: number;

  /**
   * Holds the currently playing audio data.
   */
  currentTrackIndex?: number | null;

  /**
   * Holds all the audio data that can be played.
   */
  tracks: IMediaData[];

  /**
   * Current volume of the player as a value between 0 and 1.
   */
  volume: number;

  /**
   * Boolean to mute player.
   */
  muted: boolean;
}
