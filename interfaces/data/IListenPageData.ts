/**
 * Defines Listen Page data interfaces and types.
 */

import { IAudioData } from './IAudioData';

export interface IListenPageData {
  episodeAudio: IAudioData;
  bgImageUrl: string;
  content: string;
  title: string;
}
