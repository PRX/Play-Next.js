/**
 * Defines episode data interfaces and types.
 */

import { IAudioData } from './IAudioData';

export interface IListenEpisodeData extends IAudioData {
  /**
   * Subtitle for the episode for use in playlist.
   */
  subtitle: string;

  /**
   * HTML content for the episode for use in episode info.
   */
  content: string;

  /**
   * Date episode was published.
   */
  pubDate: string;
}
