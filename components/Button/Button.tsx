/**
 * @file Button.tsx
 * Basic text button component.
 */

import type React from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

export type ButtonProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  variation?: 'default' | 'outline' | 'ghost' | 'link';
};

function Button({ className, variation, children, ...rest }: ButtonProps) {
  return (
    <a
      className={clsx(styles.root, className)}
      data-variation={variation || 'default'}
      {...rest}
    >
      {children}
    </a>
  );
}

export default Button;
