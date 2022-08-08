/**
 * @file scriptRemove.ts
 * Remove script tags.
 */
import { DomElement } from 'htmlparser2/index';

const scriptRemove = (node: DomElement) => {
  if (node.type === 'tag' && node.name === 'script') {
    return null;
  }

  return undefined;
};

export default scriptRemove;
