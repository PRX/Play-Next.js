/**
 * @file PlaybackRateControls.tsx
 * Provide controls to change playback speed.
 */

import type React from 'react';
import { ChangeEvent, useContext } from 'react';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import RadioGroup from '@components/RadioGroup';
import styles from './PlaybackRateControls.module.scss';

export type PlaybackRateControlsProps = {
  className?: string;
};

const PlaybackRateControls: React.FC<PlaybackRateControlsProps> = ({
  className
}) => {
  const { state, setPlaybackRate } = useContext(PlayerContext);
  const { playbackRate } = state;
  const playbackSpeedOption = [
    '0.5',
    { value: '1', label: 'Normal' },
    '1.5',
    '2'
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const newPlaybackRate = parseFloat(target.value);

    if (target.checked) {
      setPlaybackRate(newPlaybackRate);
    }
  };

  return (
    <RadioGroup
      className={clsx(styles.root, className)}
      options={playbackSpeedOption}
      defaultValue="1"
      value={`${playbackRate}`}
      name="PlaybackRate"
      onChange={handleChange}
    />
  );
};

export default PlaybackRateControls;
