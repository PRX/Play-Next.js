/**
 * @file AudioPlayer.reducer.ts
 * Defines reducer for handling audio player state actions.
 */

import { IEmbedState } from '@interfaces/states/embed';
import { EmbedActionTypes as ActionTypes, EmbedAction } from './Embed.actions';

export const embedInitialState: IEmbedState = {
  currentTrack: null,
  shareShown: false,
  followShown: false,
  supportShown: false
};

export const embedStateReducer = (
  state: IEmbedState,
  action: EmbedAction
): IEmbedState => {
  const { tracks, shareShown, followShown, supportShown } = state;

  switch (action.type) {
    case ActionTypes.EMBED_CURRENT_TRACK_UPDATE:
      return { ...state, currentTrack: action.payload };

    case ActionTypes.EMBED_APPEND_TRACKS:
      return { ...state, tracks: [...(tracks || []), ...action.payload] };

    case ActionTypes.EMBED_SHOW_SHARE_DIALOG:
      return { ...state, shareShown: true };

    case ActionTypes.EMBED_HIDE_SHARE_DIALOG:
      return { ...state, shareShown: false };

    case ActionTypes.EMBED_TOGGLE_SHARE_DIALOG_SHOWN:
      return { ...state, shareShown: !shareShown };

    case ActionTypes.EMBED_SHOW_FOLLOW_DIALOG:
      return { ...state, followShown: true };

    case ActionTypes.EMBED_HIDE_FOLLOW_DIALOG:
      return { ...state, followShown: false };

    case ActionTypes.EMBED_TOGGLE_FOLLOW_DIALOG_SHOWN:
      return { ...state, followShown: !followShown };

    case ActionTypes.EMBED_SHOW_SUPPORT_DIALOG:
      return { ...state, supportShown: true };

    case ActionTypes.EMBED_HIDE_SUPPORT_DIALOG:
      return { ...state, supportShown: false };

    case ActionTypes.EMBED_TOGGLE_SUPPORT_DIALOG_SHOWN:
      return { ...state, supportShown: !supportShown };

    default:
      return state;
  }
};
