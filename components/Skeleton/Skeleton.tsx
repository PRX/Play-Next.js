/**
 * @file Skeleton.tsx
 * Skeleton placeholder component.
 */

import type { CSSProperties } from 'react';
import clsx from 'clsx';
import styles from './Skeleton.module.scss';

export type SkeletonProps = {
  className?: string;
  lines?: number;
  width?: number | string;
  height?: number | string;
};

const Skeleton = ({ className, lines, width, height }: SkeletonProps) => {
  if (lines && lines > 1) {
    return (
      <div
        className={styles.wrapper}
        style={
          {
            ...(width && {
              '--skeleton--width':
                typeof width === 'number' ? `${width}px` : width
            }),
            ...(height && {
              '--skeleton--height':
                typeof height === 'number' ? `${height}px` : height
            })
          } as CSSProperties
        }
      >
        {[...new Array(lines).fill(0).keys()].map((k) => (
          <span
            key={k}
            className={clsx(className, styles.root)}
            style={
              {
                ...(height && {
                  '--skeleton--height':
                    typeof height === 'number' ? `${height}px` : height
                })
              } as CSSProperties
            }
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={clsx(className, styles.root)}
      style={
        {
          ...(width && {
            '--skeleton--width':
              typeof width === 'number' ? `${width}px` : width
          }),
          ...(height && {
            '--skeleton--height':
              typeof height === 'number' ? `${height}px` : height
          })
        } as CSSProperties
      }
    />
  );
};

export default Skeleton;
