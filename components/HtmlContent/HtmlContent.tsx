/**
 * @file HtmlContent.tsx
 * Component for rendering HTML content.
 */

import type { ReactElement } from 'react';
import type { DomElement } from 'htmlparser2/index';
import type { Transform } from 'react-html-parser';
import ReactHtmlParser from 'react-html-parser';
import scriptRemove from './transforms/scriptRemove';

export interface IHtmlContentProps {
  html: string;
  transforms?: ((
    N: DomElement, // eslint-disable-line no-unused-vars
    F: Transform, // eslint-disable-line no-unused-vars
    I: number // eslint-disable-line no-unused-vars
  ) => ReactElement | void | null)[];
}

const HtmlContent = ({ html, transforms = [] }: IHtmlContentProps) => {
  const cleanHtml = (dirtyHtml: string) =>
    [(h: string) => h.replace(/<[^>/]+>(\s|&nbsp;)*<\/[^>]+>/g, '')].reduce(
      (acc, func) => func(acc),
      dirtyHtml
    );
  const transform = (node: DomElement, index: number) =>
    [scriptRemove, ...transforms].reduce(
      (acc, func) => (acc || acc === null ? acc : func(node, transform, index)),
      undefined
    );

  return (
    !!html && (
      <>
        {ReactHtmlParser(cleanHtml(html), {
          transform: transform as Transform
        })}
      </>
    )
  );
};

export default HtmlContent;
