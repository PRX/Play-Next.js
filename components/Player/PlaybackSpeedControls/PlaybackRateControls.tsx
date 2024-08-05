/**
 * @file PlaybackRateControls.tsx
 * Provide controls to change playback speed.
 */

import type React from 'react';
import { ChangeEvent, useContext } from 'react';
import clsx from 'clsx';
import PlayerContext from '@contexts/PlayerContext';
import RadioGroup, { RadioGroupOption } from '@components/RadioGroup';
import styles from './PlaybackRateControls.module.scss';

export type PlaybackRateControlsProps = {
  className?: string;
};

const PlaybackRateControls: React.FC<PlaybackRateControlsProps> = ({
  className
}) => {
  const { state, setPlaybackRate } = useContext(PlayerContext);
  const { playbackRate } = state;
  const playbackSpeedOption: RadioGroupOption[] = [
    { value: '0.5', labelProps: { 'aria-label': 'Half speed' } },
    {
      value: '1',
      label: 'Normal',
      labelProps: { 'aria-label': 'Normal speed' }
    },
    {
      value: '1.5',
      labelProps: { 'aria-label': 'One and a half times speed' }
    },
    { value: '2', labelProps: { 'aria-label': 'Two times speed' } }
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
