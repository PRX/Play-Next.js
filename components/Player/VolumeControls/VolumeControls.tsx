/**
 * @file VolumeControls.tsx
 * Component to provide controls to mute and change volume.
 */

import type React from 'react';
import { FormEvent, useContext } from 'react';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import IconButton from '@components/IconButton';
import Slider from '@components/Slider';
import VolumeDownIcon from '@svg/icons/VolumeDown.svg';
import VolumeOffIcon from '@svg/icons/VolumeOff.svg';
import VolumeUpIcon from '@svg/icons/VolumeUp.svg';
import styles from './VolumeControls.module.scss';

export type VolumeControlsProps = {
  className?: string;
  id?: string;
};

const VolumeControls: React.FC<VolumeControlsProps> = ({ className, id }) => {
  const { state, toggleMute, setVolume } = useContext(PlayerContext);
  const { muted, volume } = state;
  const VolumeIcon =
    (volume === 0 && VolumeOffIcon) ||
    (volume < 0.5 && VolumeDownIcon) ||
    VolumeUpIcon;

  const handleClick = () => {
    if (volume === 0) {
      setVolume(0.5);
    } else {
      toggleMute();
    }
  };

  const handleSliderInput = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);

    setVolume(newVolume);
  };

  return (
    <div className={clsx(styles.root, className)}>
      <IconButton
        className={styles.muteButton}
        title={`${!muted ? 'Mute' : 'Unmute'} (m)`}
        aria-keyshortcuts="m"
        type="button"
        onClick={handleClick}
      >
        {!muted ? <VolumeIcon /> : <VolumeOffIcon />}
      </IconButton>
      <Slider
        onInput={handleSliderInput}
        defaultValue={volume}
        min={0}
        max={1}
        step={0.01}
        title="Volume (-, =)"
        aria-keyshortcuts="Minus, Equal"
        id={id || 'volume'}
      />
      <span className={styles.volume}>{`${(volume * 100).toFixed(0)}%`}</span>
    </div>
  );
};

export default VolumeControls;
