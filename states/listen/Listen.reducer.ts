/**
 * @file Listen.reducer.ts
 * Defines reducer for handling listen page state actions.
 */

import { IListenState } from '@interfaces/states/listen';
import {
  ListenActionTypes as ActionTypes,
  ListenAction
} from './Listen.actions';

export const listenInitialState: IListenState = {
  view: null,
  episodeGuid: null,
  podcastShareShown: false,
  podcastFollowShown: false,
  podcastSupportShown: false,
  episodeShareShown: false
};

export const listenStateReducer = (
  state: IListenState,
  action: ListenAction
): IListenState => {
  const {
    podcastShareShown,
    podcastFollowShown,
    podcastSupportShown,
    episodeShareShown
  } = state;

  switch (action.type) {
    case ActionTypes.LISTEN_VIEW_EPISODE:
      return { ...state, view: 'episode', episodeGuid: action.payload };

    case ActionTypes.LISTEN_VIEW_PODCAST:
      return { ...state, view: 'podcast', episodeGuid: null };

    case ActionTypes.LISTEN_PODCAST_SHOW_SHARE_DIALOG:
      return { ...state, podcastShareShown: true };

    case ActionTypes.LISTEN_PODCAST_HIDE_SHARE_DIALOG:
      return { ...state, podcastShareShown: false };

    case ActionTypes.LISTEN_PODCAST_TOGGLE_SHARE_DIALOG_SHOWN:
      return { ...state, podcastShareShown: !podcastShareShown };

    case ActionTypes.LISTEN_PODCAST_SHOW_FOLLOW_DIALOG:
      return { ...state, podcastFollowShown: true };

    case ActionTypes.LISTEN_PODCAST_HIDE_FOLLOW_DIALOG:
      return { ...state, podcastFollowShown: false };

    case ActionTypes.LISTEN_PODCAST_TOGGLE_FOLLOW_DIALOG_SHOWN:
      return { ...state, podcastFollowShown: !podcastFollowShown };

    case ActionTypes.LISTEN_PODCAST_SHOW_SUPPORT_DIALOG:
      return { ...state, podcastSupportShown: true };

    case ActionTypes.LISTEN_PODCAST_HIDE_SUPPORT_DIALOG:
      return { ...state, podcastSupportShown: false };

    case ActionTypes.LISTEN_PODCAST_TOGGLE_SUPPORT_DIALOG_SHOWN:
      return { ...state, podcastSupportShown: !podcastSupportShown };

    case ActionTypes.LISTEN_EPISODE_SHOW_SHARE_DIALOG:
      return { ...state, episodeShareShown: true };

    case ActionTypes.LISTEN_EPISODE_HIDE_SHARE_DIALOG:
      return { ...state, episodeShareShown: false };

    case ActionTypes.LISTEN_EPISODE_TOGGLE_SHARE_DIALOG_SHOWN:
      return { ...state, episodeShareShown: !episodeShareShown };

    default:
      return state;
  }
};
