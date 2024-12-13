/**
 * Defines interfaces for request errors.
 */

import { IncomingMessage } from 'http';

export interface IReqError extends Error {
  err: Error;
  req: IncomingMessage;
}
