/**
 * @file IStateContext.ts
 * Interface for state context. Used to pass state and dispatcher via context.
 */

import type React from 'react';
import type { IPlayerAction } from '@states/player/Player.actions';
import type { IPlayerState } from '../states/player';

export interface IStateContext {
  state: IPlayerState;
  dispatch: React.Dispatch<IPlayerAction>;
}
