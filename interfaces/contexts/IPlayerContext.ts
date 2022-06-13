/**
 * @file IStateContext.ts
 * Interface for player context. Extends IStateContext and props specific to
 * player.
 */

import type { IStateContext } from './IStateContext';

export interface IPlayerContext extends IStateContext {
  audioElm: HTMLAudioElement;
  imageUrl: string;
}
