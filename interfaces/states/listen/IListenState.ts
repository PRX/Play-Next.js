/**
 * @file IListenState.ts
 * Define state interface used for listen page.
 */

export type ListenView =
  | 'podcast'
  | 'podcast-init'
  | 'episode'
  | 'episode-init';

export interface IListenState {
  /**
   * Current view to be shown.
   */
  view: ListenView;

  /**
   * GUID for te episode to view.
   */
  episodeGuid: string;

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
