/**
 * @file IStateContext.ts
 * Interface for state context. Used to pass state and dispatcher via context.
 */

import type React from 'react';

export interface IStateContext<StateType, ActionType> {
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
}
