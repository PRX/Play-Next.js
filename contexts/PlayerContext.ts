/**
 * @file PlayerContext.js
 * Creates context for cta region data.
 */

import { IPlayerContext } from '@interfaces/contexts/IPlayerContext';
import React from 'react';

const PlayerContext = React.createContext({
  state: null,
  dispatch: null,
  audioElm: null,
  imageUrl: null
} as IPlayerContext);

export default PlayerContext;
