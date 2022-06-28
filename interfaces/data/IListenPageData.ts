/**
 * Defines Listen P\page data interfaces and types.
 */

import { IAudioData } from './IAudioData';

export interface IListenPageData {
  episodeAudio: IAudioData;
  bgImageUrl: string;
  content: string;
  title: string;
}
