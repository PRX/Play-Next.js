/**
 * @file IListenContext.ts
 * Interface for listen page context.
 */

import type { IListenConfig } from '@interfaces/config';
import type { IListenData } from '@interfaces/data';
import type { IListenState } from '@interfaces/states/listen';
import type { ListenAction } from '@states/listen/Listen.actions';
import type { IStateContext } from './IStateContext';

export interface IListenContext
  extends IStateContext<IListenState, ListenAction> {
  config: IListenConfig;
  data: IListenData;
}
