/**
 * @file PlayerThumbnail.tsx
 * Player thumbnail component for player.
 */

import type React from 'react';
import { useContext } from 'react';
import PrxImage from '@components/PrxImage';
import PlayerContext from '@contexts/PlayerContext';
import ThemeVars from '@components/ThemeVars';
import styles from './PlayerThumbnail.module.scss';

export interface IPlayerThumbnailProps {
  sizes?: string;
}

const PlayerThumbnail: React.FC<IPlayerThumbnailProps> = ({ sizes }) => {
  const { state, imageUrl: defaultImageUrl } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const { imageUrl, title } = tracks[currentTrackIndex];

  return (
    imageUrl && (
      <div className={styles.root}>
        <ThemeVars theme="PlayerThumbnail" cssProps={styles} />
        <PrxImage
          className={styles.image}
          src={imageUrl || defaultImageUrl}
          alt={`Thumbnail for "${title}".`}
          layout="fill"
          sizes={sizes}
          priority
        />
      </div>
    )
  );
};

export default PlayerThumbnail;
