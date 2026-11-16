/**
 * @file PlayerThumbnail.tsx
 * Player thumbnail component for player.
 */

import type React from 'react';
import type { IMediaData } from '@interfaces/data';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import PrxImage, { IPrxImageProps } from '@components/PrxImage';
import styles from './PlayerThumbnail.module.scss';

export interface IPlayerThumbnailProps extends Partial<IPrxImageProps> {
  imageClassName?: string;
}

const PlayerThumbnail: React.FC<IPlayerThumbnailProps> = ({
  className,
  imageClassName,
  fill,
  width,
  height,
  ...props
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const isInitialLoad = useRef(true);
  const { state, imageUrl: defaultImageUrl } = useContext(PlayerContext);
  const [isLoading, setIsLoading] = useState(false);
  const { currentTrack } = state;
  const { imageUrl, title } = currentTrack || ({} as IMediaData);
  const srcUrl = imageUrl || defaultImageUrl;
  const rootClassNames = clsx(styles.root, className, {
    [styles.loaded]: !isLoading || imageRef.current?.complete
  });

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad.current) {
      setIsLoading(true);
    }
    isInitialLoad.current = false;
  }, [srcUrl]);

  return (
    srcUrl && (
      <div
        className={rootClassNames}
        style={{
          ...(!fill && {
            width,
            height
          })
        }}
      >
        <PrxImage
          ref={imageRef}
          src={srcUrl}
          alt={`Thumbnail for "${title}".`}
          fill={fill}
          {...(!fill && {
            width,
            height
          })}
          priority
          {...props}
          className={clsx(styles.image, imageClassName)}
          onLoad={handleLoad}
        />
      </div>
    )
  );
};

export default PlayerThumbnail;
