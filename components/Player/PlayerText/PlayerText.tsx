/**
 * @file PlayerText.tsx
 * Component to display text (title, subtitle) in player.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import ThemeVars from '@components/ThemeVars';
import styles from './PlayerText.module.scss';

export interface IPlayerTextProps {}

const PlayerText: React.FC<IPlayerTextProps> = () => {
  const { state } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const { title, subtitle } = tracks[currentTrackIndex];

  const wrapWords = (text: string) =>
    text.match(/\s*\S+/g).map((word, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <span key={`${word}:${i}`}>{word}</span>
    ));

  return (
    <>
      <ThemeVars theme="PlayerText" cssProps={styles} />
      <h2 className={styles.title}>{wrapWords(title)}</h2>
      <p className={styles.subtitle}>{wrapWords(subtitle)}</p>
    </>
  );
};

export default PlayerText;
