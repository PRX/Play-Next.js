/**
 * Defines Listen P\page data interfaces and types.
 */

import { IAudioData } from './IAudioData';

export interface IListenData {
  episodeAudio: IAudioData;
  bgImageUrl: string;
  content: string;
  title: string;
}
