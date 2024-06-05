/**
 * Defines RSS item interfaces and types.
 */

import type Parser from 'rss-parser';
import { IRssPodcast } from './IRssPodcast';

export interface IRssItem extends Parser.Item {
  [key: string]: any;
  itunes?: {
    [key: string]: any;
  };
  podcast?: IRssPodcast;
}
