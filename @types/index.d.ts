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

  export interface HTMLDivElement {
    inert?: boolean | '';
  }
}

declare module 'react' {
  import React = require('react');

  export interface DOMAttributes {}
  export interface HTMLAttributes<T> extends DOMAttributes<T> {
    /**
     * Boolean attribute indicating that the browser will ignore the element.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert MDN Web Docs}
     */
    inert?: '';
  }

  export namespace JSX {
    export interface IntrinsicElements {
      'hls-video': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLMediaElement> & {
          src: string;
          width?: string;
          height?: string;
          controls?: boolean;
        },
        HTMLMediaElement
      >;
      'videojs-video': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLMediaElement> & {
          src: string;
          width?: string;
          height?: string;
          controls?: boolean;
        },
        HTMLMediaElement
      >;
    }
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
