/**
 * @file CoverArt.tsx
 * Cover art component for player.
 */

import { useContext } from 'react';
import PrxImage from '@components/PrxImage';
import PlayerContext from '@contexts/PlayerContext';
import styles from './CoverArt.module.scss';

const CoverArt = () => {
  const { state } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const { imageUrl, title } = tracks[currentTrackIndex];

  return (
    imageUrl && (
      <div className={styles.coverArt}>
        <PrxImage
          src={imageUrl}
          alt={`Cover art for "${title}".`}
          layout="fill"
          priority
        />
      </div>
    )
  );
};

export default CoverArt;
