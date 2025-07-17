/**
 * @file IconButton.tsx
 * Play button component to toggle playing state of player.
 */

import type React from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './IconButton.module.scss';

export interface IIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  download?: boolean | string;
}

const IconButton = forwardRef<any, IIconButtonProps>(
  ({ children, className = null, href = null, download, ...props }, ref) =>
    href ? (
      <a
        className={clsx(styles.iconButton, className)}
        href={href}
        rel="noreferrer"
        ref={ref}
        title={props.title}
        aria-label={props['aria-label']}
        {...((download && { download }) || { target: '_blank' })}
      >
        {children}
      </a>
    ) : (
      <button
        {...props}
        className={clsx(styles.iconButton, className)}
        type="button"
        ref={ref}
      >
        {children}
      </button>
    )
);

export default IconButton;
