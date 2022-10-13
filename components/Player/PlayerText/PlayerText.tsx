/**
 * @file PlayerText.tsx
 * Component to display text (title, subtitle) in player.
 */

import type React from 'react';
import type { IAudioData } from '@interfaces/data/IAudioData';
import { useContext } from 'react';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import ThemeVars from '@components/ThemeVars';
import Marquee from '@components/Marquee';
import ExplicitIcon from '@svg/icons/Explicit.svg';
import styles from './PlayerText.module.scss';

export interface IPlayerTextProps {}

const PlayerText: React.FC<IPlayerTextProps> = () => {
  const { state } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const { title, subtitle, explicit } =
    tracks[currentTrackIndex] || ({} as IAudioData);

  const wrapWords = (text: string) =>
    text?.match(/\s*\S+/g).map((word, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <span key={`${word}:${i}`}>{word}</span>
    ));

  return (
    <div className={clsx(styles.root, { [styles.isExplicit]: explicit })}>
      <ThemeVars theme="PlayerText" cssProps={styles} />
      {explicit && <ExplicitIcon className={styles.explicit} />}
      <h2 className={styles.title} title={title}>
        <Marquee>{title}</Marquee>
      </h2>
      <p title={subtitle} className={styles.subtitle}>
        {wrapWords(subtitle)}
      </p>
    </div>
  );
};

export default PlayerText;
