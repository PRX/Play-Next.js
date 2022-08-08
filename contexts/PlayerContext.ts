/**
 * @file PlayerContext.js
 * Creates context for cta region data.
 */

import type { IPlayerContext } from '@interfaces/context';
import React from 'react';

const PlayerContext = React.createContext({
  state: null,
  dispatch: null,
  audioElm: null,
  imageUrl: null
} as IPlayerContext);

export default PlayerContext;
