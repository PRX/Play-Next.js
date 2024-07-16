/**
 * @file Slider.tsx
 * Basic slider component.
 */

import type React from 'react';
import { type CSSProperties } from 'react';
import { useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Slider.module.scss';

export type SliderProps = React.JSX.IntrinsicElements['input'] & {};

function calculateProgress(
  value: string | number,
  min?: string | number,
  max?: string | number
) {
  const progress =
    (parseFloat(`${value}`) - parseFloat(`${min || 0}`)) /
    (parseFloat(`${max || 100}`) - parseFloat(`${min || 0}`));

  return progress;
}

function Slider({ className, defaultValue, ...rest }: SliderProps) {
  const rootRef = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>();
  const { min, max } = rest;
  const currentValue = parseFloat(
    Array.isArray(defaultValue) ? defaultValue[0] : defaultValue
  );
  const progress = calculateProgress(currentValue, min, max);

  useEffect(() => {
    const inputElm = inputRef.current;

    function handleChange(e: Event) {
      const target = e.target as HTMLInputElement;

      rootRef.current?.style.setProperty(
        '--progress',
        `${calculateProgress(target.value, target.min, target.max)}`
      );
    }

    inputElm?.addEventListener('input', handleChange);

    return () => {
      inputElm.removeEventListener('input', handleChange);
    };
  }, []);

  return (
    <div
      className={clsx(styles.root, className)}
      style={{ '--progress': progress } as CSSProperties}
      ref={rootRef}
    >
      <input
        type="range"
        className={styles.input}
        defaultValue={currentValue}
        {...rest}
        ref={inputRef}
      />
    </div>
  );
}

export default Slider;
