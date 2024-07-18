/* eslint-disable no-unused-vars */
/**
 * @file IStateContext.ts
 * Interface for player context. Extends IStateContext and props specific to
 * player.
 */

import { IAudioData } from '@interfaces/data';
import type { IPlayerState } from '@interfaces/states';
import type { IPlayerAction } from '@states/player/Player.actions';
import type { IStateContext } from './IStateContext';

export interface IPlayerContext
  extends IStateContext<IPlayerState, IPlayerAction> {
  audioElm: HTMLAudioElement;
  imageUrl: string;
  play(): void;
  playTrack(index: number): void;
  pause(): void;
  togglePlayPause(): void;
  mute(): void;
  unmute(): void;
  toggleMute(): void;
  seekTo(time: number): void;
  seekBy(time: number): void;
  replay(): void;
  forward(): void;
  seekToRelative(time: number): void;
  nextTrack(): void;
  previousTrack(): void;
  setTrack(index: number): void;
  setTracks(tracks: IAudioData[]): void;
  setVolume(newVolume: number): void;
  setPlaybackRate(newPlaybackRate: number): void;
}
