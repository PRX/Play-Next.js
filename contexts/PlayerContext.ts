/**
 * @file PlayerContext.js
 * Creates context for cta region data.
 */

import { IStateContext } from '@interfaces/states/iStateContext';
import React from 'react';

const PlayerContext = React.createContext({
  state: null,
  dispatch: null
} as IStateContext);

export default PlayerContext;
