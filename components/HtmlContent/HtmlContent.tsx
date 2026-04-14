/**
 * @file HtmlContent.tsx
 * Component for rendering HTML content.
 */

import type { ReactElement } from 'react';
import parse, {
  type HTMLReactParserOptions,
  type DOMNode
} from 'html-react-parser';
import scriptRemove from './transforms/scriptRemove';

export interface IHtmlContentProps {
  html: string;
  transforms?: ((
    N: DOMNode, // eslint-disable-line no-unused-vars
    F: HTMLReactParserOptions['replace'], // eslint-disable-line no-unused-vars
    I: number // eslint-disable-line no-unused-vars
  ) => ReactElement | void | null)[];
}

const HtmlContent = ({ html, transforms = [] }: IHtmlContentProps) => {
  const cleanHtml = (dirtyHtml: string) =>
    [(h: string) => h.replace(/<[^>/]+>(\s|&nbsp;)*<\/[^>]+>/g, '')].reduce(
      (acc, func) => func(acc),
      dirtyHtml
    );
  const replace = (node: DOMNode, index: number) =>
    [scriptRemove, ...transforms].reduce(
      (acc, func) => (acc || acc === null ? acc : func(node, replace, index)),
      undefined
    );

  return (
    !!html && (
      <>
        {parse(cleanHtml(html), {
          replace
        })}
      </>
    )
  );
};

export default HtmlContent;
