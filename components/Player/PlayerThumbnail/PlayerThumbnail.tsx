/**
 * @file PlayerThumbnail.tsx
 * Player thumbnail component for player.
 */

import type React from 'react';
import { useContext } from 'react';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import PrxImage, { IPrxImageProps } from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import styles from './PlayerThumbnail.module.scss';

export interface IPlayerThumbnailProps extends Partial<IPrxImageProps> {
  imageClassName?: string;
}

const PlayerThumbnail: React.FC<IPlayerThumbnailProps> = ({
  className,
  imageClassName,
  layout = 'fill',
  width,
  height,
  ...props
}) => {
  const { state, imageUrl: defaultImageUrl } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const { imageUrl, title } = tracks[currentTrackIndex];
  const srcUrl = imageUrl || defaultImageUrl;

  return (
    srcUrl && (
      <div className={clsx(styles.root, className)}>
        <ThemeVars theme="PlayerThumbnail" cssProps={styles} />
        <PrxImage
          src={srcUrl}
          alt={`Thumbnail for "${title}".`}
          layout={layout}
          {...(layout !== 'fill' && {
            width,
            height
          })}
          priority
          {...props}
          className={clsx(styles.image, imageClassName)}
        />
      </div>
    )
  );
};

export default PlayerThumbnail;
