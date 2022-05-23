/**
 * @file IPlayerVolumeState.ts
 * Define state interface used to describe player volume model.
 */

export interface IPlayerVolumeState {
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
