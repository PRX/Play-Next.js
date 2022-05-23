/**
 * @file PlayerContext.js
 * Creates context for cta region data.
 */

import { IPlayerContext } from '@interfaces/context/IPlayerContext';
import React from 'react';

const PlayerContext = React.createContext({
  state: null,
  dispatch: null
} as IPlayerContext);

export default PlayerContext;
