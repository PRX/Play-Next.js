/**
 * @file AudioPlayer.reducer.ts
 * Defines reducer for handling audio player state actions.
 */

import { IEmbedState } from '@interfaces/states/embed';
import { EmbedActionTypes as ActionTypes, EmbedAction } from './Embed.actions';

export const embedInitialState: IEmbedState = {
  closedCaptionsShown: false,
  shareShown: false,
  followShown: false,
  supportShown: false,
  webMonetizationShown: false
};

export const embedStateReducer = (
  state: IEmbedState,
  action: EmbedAction
): IEmbedState => {
  const {
    closedCaptionsShown,
    shareShown,
    followShown,
    supportShown,
    webMonetizationShown
  } = state;

  switch (action.type) {
    case ActionTypes.EMBED_SHOW_CLOSED_CAPTIONS_DIALOG:
      return { ...state, closedCaptionsShown: true };

    case ActionTypes.EMBED_HIDE_CLOSED_CAPTIONS_DIALOG:
      return { ...state, closedCaptionsShown: false };

    case ActionTypes.EMBED_TOGGLE_CLOSED_CAPTIONS_DIALOG_SHOWN:
      return { ...state, closedCaptionsShown: !closedCaptionsShown };

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

    case ActionTypes.EMBED_SHOW_WEB_MONETIZATION_DIALOG:
      return { ...state, webMonetizationShown: true };

    case ActionTypes.EMBED_HIDE_WEB_MONETIZATION_DIALOG:
      return { ...state, webMonetizationShown: false };

    case ActionTypes.EMBED_TOGGLE_WEB_MONETIZATION_DIALOG_SHOWN:
      return { ...state, webMonetizationShown: !webMonetizationShown };

    default:
      return state;
  }
};
