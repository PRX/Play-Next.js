/**
 * Defines RSS item interfaces and types.
 */

import type Parser from 'rss-parser';

export interface IRssItem extends Parser.Item {
  [key: string]: any;
  itunes?: {
    [key: string]: any;
  };
}
