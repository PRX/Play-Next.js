/**
 * Defines interfaces for RSS proxy errors.
 */

export interface IRssProxyError extends Error {
  url: string;
}
