/**
 * @file IconButton.tsx
 * Play button component to toggle playing state of player.
 */

import React from 'react';
import clsx from 'clsx';
import ThemeVars from '@components/ThemeVars';
import styles from './IconButton.module.scss';

export interface IIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const IconButton = React.forwardRef<HTMLButtonElement, IIconButtonProps>(
  ({ className, children, ...props }, ref) => (
    <>
      <ThemeVars theme="IconButton" cssProps={styles} />
      <button
        {...props}
        ref={ref}
        className={clsx(styles.iconButton, className)}
        type="button"
      >
        {children}
      </button>
    </>
  )
);

export default IconButton;
