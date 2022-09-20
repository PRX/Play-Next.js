/**
 * Define RSS interface and types.
 */

import Parser from 'rss-parser';
import { IRssItem } from './IRssItem';

export interface IRss extends Parser.Output<IRssItem> {
  /**
   * Copyright string.
   */
  copyright?: string;
  podcast?: {
    [key: string]: any;
    value?: any;
  };
}
