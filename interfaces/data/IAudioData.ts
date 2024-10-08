/**
 * Defines audio data interfaces and types.
 */

import {
  IRssPodcastTranscript,
  IRssPodcastTranscriptJson
} from './IRssPodcast';

/**
 * Audio data interface.
 */
export interface IAudioData {
  /**
   * Globally unique id for the audio.
   */
  guid: string;

  /**
   * Link URL to view more about the audio.
   */
  link: string;

  /**
   * Source URL for the audio file.
   */
  url: string;

  /**
   * File size audio file in bytes.
   */
  fileSize: number;

  /**
   * Source URL for the preview audio file.
   * Should be used for playback when provided.
   * Do NOT include this in shared URL's or HTML markup.
   */
  previewUrl?: string;

  /**
   * Title to be displayed in player.
   */
  title: string;

  /**
   * Subtitle to display below the title in player.
   */
  subtitle?: string;

  /**
   * Source URL for image to use in thumbnail or feature art.
   */
  imageUrl?: string;

  /**
   * Season for episodic audio. Used to filter playlists.
   */
  season?: number;

  /**
   * Duration of audio track formatted as '[HH:]MM:SS'.
   */
  duration?: string;

  /**
   * Categories that apply to audio. Used to filter playlists.
   */
  categories?: string[];

  /**
   * Contains explicit content.
   */
  explicit?: boolean;

  /**
   * Available transcripts od the audio.
   */
  transcripts?: IRssPodcastTranscript[];

  /**
   * Parsed JSON version of transcript.
   */
  transcriptData?: IRssPodcastTranscriptJson;
}
