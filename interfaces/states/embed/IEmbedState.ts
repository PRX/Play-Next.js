/**
 * @file IEmbedState.ts
 * Define state interface used for embed page.
 */

export interface IEmbedState {
  /**
   * Flag to show share menu dialog.
   */
  shareShown: boolean;

  /**
   * Flag to show follow menu dialog.
   */
  followShown: boolean;

  /**
   * Flag to show support menu dialog.
   */
  supportShown: boolean;
}
