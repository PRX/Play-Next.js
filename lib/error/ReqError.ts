import { IncomingMessage } from 'http';

class ReqError extends Error {
  public req: IncomingMessage;

  public err: Error;

  constructor(err: Error, req: IncomingMessage) {
    super(err.message);
    this.name = 'ReqError';
    this.message = err.message;
    this.err = err;
    this.req = req;
  }
}

export default ReqError;
