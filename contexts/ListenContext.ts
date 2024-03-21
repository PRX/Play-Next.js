/**
 * @file ListenContext.js
 * Creates context for listen page data.
 */

import type { IListenContext } from '@interfaces/context';
import React from 'react';

const ListenContext = React.createContext({
  state: null,
  dispatch: null,
  config: null
} as IListenContext);

export default ListenContext;
