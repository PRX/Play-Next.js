/**
 * Defines listen page media data interfaces and types.
 */

import { IAudioData } from './IAudioData';

export interface IListenMediaSource {
  /**
   * Mime type of the source.
   */
  type: string;

  /**
   * Source URL for the file.
   */
  url: string;

  /**
   * Length of the file in bytes.
   */
  length: number;
}

/**
 * Listen media data interface.
 */
export interface IListenMediaData extends IAudioData {
  /**
   * Media sources.
   */
  sources: IListenMediaSource[];

  /**
   * Index of audio in sources. -1 when no audio source.
   */
  audioSourceIndex: number;

  /**
   * Index of video in sources. -1 when no video source.
   */
  videoSourceIndex: number;

  /**
   * Flag when sources contain video source.
   */
  hasVideo: boolean;
}
