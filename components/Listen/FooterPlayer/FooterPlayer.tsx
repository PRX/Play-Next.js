/**
 * @file FooterPlayer.tsx
 * Component for audio player controls in listen page footer.
 */

import { forwardRef, useContext } from 'react';
import clsx from 'clsx';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import PlayerContext from '@contexts/PlayerContext';
import Marquee from '@components/Marquee';
import PreviousButton from '@components/Player/PreviousButton';
import NextButton from '@components/Player/NextButton';
import ReplayButton from '@components/Player/ReplayButton';
import PlayButton from '@components/Player/PlayButton';
import ForwardButton from '@components/Player/ForwardButton';
import PlayerProgress from '@components/Player/PlayerProgress';
import listenStyles from '@components/Listen/Listen.module.scss';
import styles from './FooterPlayer.module.scss';

export interface IFooterPlayerProps {}

const FooterPlayer = forwardRef<HTMLDivElement, IFooterPlayerProps>(
  (props, ref) => {
    const { imageUrl: defaultThumbUrl, state } = useContext(PlayerContext);
    const { currentTrackIndex, tracks } = state;
    const currentTrack = tracks[currentTrackIndex];
    const { imageUrl, title } = currentTrack || {};
    const thumbSrc = imageUrl || defaultThumbUrl;
    const thumbSizes = [
      `(min-width: ${listenStyles.breakpointFull}) ${styles['--footerPlayer-thumbnail-size']}`,
      `${styles['--footerPlayer-thumbnail-size--mobile']}`
    ].join(',');

    return (
      <>
        <ThemeVars theme="Listen FooterPlayer" cssProps={styles} />
        <div
          ref={ref}
          className={clsx(styles.root, {
            [styles.isShown]:
              currentTrackIndex !== null && currentTrackIndex >= 0
          })}
        >
          <div className={styles.thumbnail}>
            <PrxImage
              src={thumbSrc}
              alt={`Thumbnail for "${title}".`}
              layout="fill"
              sizes={thumbSizes}
            />
          </div>

          <div className={styles.title}>
            <Marquee>{title}</Marquee>
          </div>

          <div className={styles.controls}>
            {tracks.length > 1 && <PreviousButton />}
            <ReplayButton />
            <PlayButton />
            <ForwardButton />
            {tracks.length > 1 && <NextButton />}
          </div>

          <div className={styles.progress}>
            <PlayerProgress />
          </div>
        </div>
      </>
    );
  }
);

export default FooterPlayer;
