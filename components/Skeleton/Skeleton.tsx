/**
 * @file Skeleton.tsx
 * Skeleton placeholder component.
 */

import type { CSSProperties } from 'react';
import clsx from 'clsx';
import styles from './Skeleton.module.scss';

export type SkeletonProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
};

const Skeleton = ({ className, width, height }: SkeletonProps) => (
  <span
    className={clsx(className, styles.root)}
    style={
      {
        ...(width && {
          '--skeleton--width': typeof width === 'number' ? `${width}px` : width
        }),
        ...(height && {
          '--skeleton--height':
            typeof height === 'number' ? `${height}px` : height
        })
      } as CSSProperties
    }
  />
);

export default Skeleton;
