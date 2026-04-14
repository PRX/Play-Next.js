/**
 * @file scriptRemove.ts
 * Remove script tags.
 */

import type { DOMNode } from 'html-react-parser';

const scriptRemove = (node: DOMNode) => {
  if (node.type === 'tag' && node.name === 'script') {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return undefined;
};

export default scriptRemove;
