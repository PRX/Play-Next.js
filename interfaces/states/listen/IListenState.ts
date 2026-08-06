/**
 * @file IListenState.ts
 * Define state interface used for listen page.
 */

export type ListenView =
  | 'podcast'
  | 'podcast-init'
  | 'episode'
  | 'episode-init';

export type ListenVideoView = 'default' | 'pip';

export type ListenVideoVisibility = 'visible' | 'hidden';

export interface IListenState {
  /**
   * Current view to be shown.
   */
  view: ListenView;

  /**
   * Current way to view videos.
   */
  videoView?: ListenVideoView;

  /**
   * Visibility of video.
   */
  videoVisibility?: ListenVideoVisibility;

  /**
   * GUID for te episode to view.
   */
  episodeGuid: string;

  /**
   * Flag to show closed captions dialog.
   */
  closedCaptionsShown: boolean;

  /**
   * Flag to show podcast share menu dialog.
   */
  podcastShareShown: boolean;

  /**
   * Flag to show podcast follow menu dialog.
   */
  podcastFollowShown: boolean;

  /**
   * Flag to show podcast support menu dialog.
   */
  podcastSupportShown: boolean;

  /**
   * Flag to show episode share menu dialog.
   */
  episodeShareShown: boolean;
}
