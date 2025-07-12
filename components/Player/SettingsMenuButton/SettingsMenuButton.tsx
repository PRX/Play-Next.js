/**
 * @file SettingsMenuButton.tsx
 * Provides player menu button that opens share modal.
 */

import type React from 'react';
import { forwardRef, useContext } from 'react';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import SettingsIcon from '@svg/icons/Settings.svg';
import VolumeOffIcon from '@svg/icons/VolumeOff.svg';
import styles from './SettingsMenuButton.module.scss';

export type SettingsMenuButtonProps = React.JSX.IntrinsicElements['button'] & {
  className?: string;
};

const SettingsMenuButton: React.FC<SettingsMenuButtonProps> = forwardRef<
  HTMLButtonElement,
  SettingsMenuButtonProps
>(({ className, ...rest }, ref) => {
  const { state } = useContext(PlayerContext);
  const { muted, playbackRate } = state;
  const showPlaybackRate = playbackRate !== 1;
  const hasFeedback = muted || showPlaybackRate;
  const rootClassNames = clsx(className, styles.root, {
    [styles.hasFeedback]: hasFeedback
  });

  return (
    <button
      title="Settings"
      {...rest}
      ref={ref}
      type="button"
      className={rootClassNames}
    >
      {hasFeedback && (
        <div className={styles.feedback}>
          {showPlaybackRate && (
            <span className={styles.feedbackItem}>{playbackRate}x</span>
          )}
          {muted && (
            <span className={styles.feedbackItem}>
              <VolumeOffIcon />
            </span>
          )}
        </div>
      )}
      <span className={styles.icon}>
        <SettingsIcon />
      </span>
    </button>
  );
});

export default SettingsMenuButton;
