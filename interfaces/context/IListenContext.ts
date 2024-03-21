/**
 * @file IListenContext.ts
 * Interface for listen page context.
 */

import { IListenConfig } from '@interfaces/config';
import type { IListenState } from '@interfaces/states/listen';
import type { ListenAction } from '@states/listen/Listen.actions';
import { IStateContext } from './IStateContext';

export interface IListenContext
  extends IStateContext<IListenState, ListenAction> {
  config: IListenConfig;
}
