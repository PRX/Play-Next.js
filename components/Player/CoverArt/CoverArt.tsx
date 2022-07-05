/**
 * @file CoverArt.tsx
 * Cover art component for player.
 */

import type React from 'react';
import type { IAudioData } from '@interfaces/data';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import PrxImage from '@components/PrxImage';
import PlayerContext from '@contexts/PlayerContext';
import styles from './CoverArt.module.scss';

export interface ICoverArtProps {}

const CoverArt: React.FC<ICoverArtProps> = () => {
  const {
    state,
    togglePlayPause,
    imageUrl: defaultImageUrl
  } = useContext(PlayerContext);
  const imageRef = useRef({ complete: false });
  const [isLoading, setIsLoading] = useState(true);
  const { tracks, currentTrackIndex } = state;
  const { imageUrl, title } = tracks[currentTrackIndex] || ({} as IAudioData);
  const srcUrl = imageUrl || defaultImageUrl;
  const rootClassNames = clsx(styles.root, {
    [styles.loaded]: !isLoading || imageRef.current.complete
  });

  const handleClick = () => {
    togglePlayPause();
  };

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
  }, [srcUrl]);

  return (
    srcUrl && (
      <button type="button" className={rootClassNames} onClick={handleClick}>
        <PrxImage
          ref={imageRef}
          src={srcUrl}
          alt={`Cover art for "${title}".`}
          layout="fill"
          priority
          onLoadingComplete={handleLoad}
          onLoad={handleLoad}
        />
      </button>
    )
  );
};

export default CoverArt;
