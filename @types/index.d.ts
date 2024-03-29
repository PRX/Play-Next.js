// eslint-disable-next-line import/no-extraneous-dependencies
import 'types-wm';

declare global {
  export interface Array<T> {
    findLastIndex(
      // eslint-disable-next-line no-unused-vars
      predicate: (value: T, index: number, obj: T[]) => unknown,
      // eslint-disable-next-line no-unused-vars
      thisArg?: any
    ): number;
  }
}

declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src; // eslint-disable-line import/no-default-export
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
