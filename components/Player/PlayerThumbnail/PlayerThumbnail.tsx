/**
 * @file PlayerThumbnail.tsx
 * Player thumbnail component for player.
 */

import type React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const { tracks, currentTrackIndex } = state;
  const { imageUrl, title } = tracks[currentTrackIndex];
  const srcUrl = imageUrl || defaultImageUrl;
  const rootClassNames = clsx(styles.root, className, {
    [styles.loaded]: !isLoading
  });

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
  }, [srcUrl]);

  return (
    srcUrl && (
      <div className={rootClassNames}>
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
          onLoadingComplete={handleLoad}
          onLoad={handleLoad}
        />
      </div>
    )
  );
};

export default PlayerThumbnail;
