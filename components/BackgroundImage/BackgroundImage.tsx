/**
 * @file BackgroundImage.tsx
 * Component for background image in header
 */

import type React from 'react';
import clsx from 'clsx';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import styles from './BackgroundImage.module.scss';

export interface IBackgroundImageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
}

const BackgroundImage: React.FC<IBackgroundImageProps> = ({
  imageUrl,
  className
}) => (
  <div className={clsx(className, styles.root)}>
    <ThemeVars theme="BackgroundImage" cssProps={styles} />
    <PrxImage
      className={styles.image}
      src={imageUrl}
      layout="fill"
      objectFit="cover"
      aria-hidden
      priority
    />
  </div>
);

export default BackgroundImage;
