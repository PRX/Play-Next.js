/**
 * @file CoverArt.tsx
 * Cover art component for player.
 */

import type React from 'react';
import { useContext } from 'react';
import { PlayerActionTypes } from '@states/player/Player.actions';
import PrxImage from '@components/PrxImage';
import PlayerContext from '@contexts/PlayerContext';
import styles from './CoverArt.module.scss';

export interface ICoverArtProps {}

const CoverArt: React.FC<ICoverArtProps> = () => {
  const { state, dispatch } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const { imageUrl, title } = tracks[currentTrackIndex];

  const handleClick = () => {
    dispatch({ type: PlayerActionTypes.PLAYER_TOGGLE_PLAYING });
  };

  return (
    imageUrl && (
      <button type="button" className={styles.root} onClick={handleClick}>
        <PrxImage
          src={imageUrl}
          alt={`Cover art for "${title}".`}
          layout="fill"
          priority
        />
      </button>
    )
  );
};

export default CoverArt;
