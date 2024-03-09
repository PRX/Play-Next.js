/**
 * Define RSS interface and types.
 */

import Parser from 'rss-parser';
import { IRssItem } from './IRssItem';
import { IRssPodcast } from './IRssPodcast';

export interface IRss extends Parser.Output<IRssItem> {
  /**
   * Copyright string.
   */
  copyright?: string;

  /**
   * Podcast namespace object.
   */
  podcast?: IRssPodcast;
}
