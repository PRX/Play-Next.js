/* eslint-disable no-unused-vars */
/**
 * @file IStateContext.ts
 * Interface for player context. Extends IStateContext and props specific to
 * player.
 */

import type { IStateContext } from './IStateContext';

export interface IPlayerContext extends IStateContext {
  audioElm: HTMLAudioElement;
  imageUrl: string;
  play(): void;
  pause(): void;
  togglePlayPause(): void;
  toggleMute(): void;
  seekTo(time: number): void;
  seekBy(time: number): void;
  replay(): void;
  forward(): void;
  seekToRelative(time: number): void;
  nextTrack(): void;
  previousTrack(): void;
  setTrack(index: number): void;
}
