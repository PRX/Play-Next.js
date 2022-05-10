/**
 * @file IStateContext.ts
 * Interface for state context. Used to pass state and dispatcher via context.
 */

import React from 'react';
import { PlayerAction } from '@states/player/Player.actions';
import { IPlayerState } from './player';

export interface IStateContext {
  state: IPlayerState;
  dispatch: React.Dispatch<PlayerAction>;
}
