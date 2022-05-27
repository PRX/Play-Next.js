/**
 * @file CoverArt.tsx
 * Cover art component for player.
 */

import React, { useContext } from 'react';
import PrxImage from '@components/PrxImage';
import PlayerContext from '@contexts/PlayerContext';
import styles from './Thumbnail.module.scss';

export interface IThumbnailProps {
  sizes?: string;
}

const Thumbnail: React.FC<IThumbnailProps> = ({ sizes }) => {
  const { state, imageUrl: defaultImageUrl } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const { imageUrl, title } = tracks[currentTrackIndex];

  return (
    imageUrl && (
      <PrxImage
        className={styles.root}
        src={imageUrl || defaultImageUrl}
        alt={`Thumbnail for "${title}".`}
        layout="fill"
        sizes={sizes}
        priority
      />
    )
  );
};

export default Thumbnail;
