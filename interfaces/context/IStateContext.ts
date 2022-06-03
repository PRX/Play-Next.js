/**
 * @file IStateContext.ts
 * Interface for state context. Used to pass state and dispatcher via context.
 */

import React from 'react';
import { IPlayerAction } from '@states/player/Player.actions';
import { IPlayerState } from '../states/player';

export interface IStateContext {
  state: IPlayerState;
  dispatch: React.Dispatch<IPlayerAction>;
}
