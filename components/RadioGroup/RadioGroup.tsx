/**
 * @file RadioGroup.tsx
 * Basic radio group component.
 */

import type React from 'react';
import clsx from 'clsx';
import styles from './RadioGroup.module.scss';

export type RadioGroupProps = React.JSX.IntrinsicElements['input'] & {
  options: (string | { value: string; label: string })[];
};

function RadioGroup({ className, options, value, ...rest }: RadioGroupProps) {
  const { name } = rest;
  const currentValue = Array.isArray(value) ? value[0] : value;

  return (
    <div className={clsx(styles.root, className)}>
      {options.map((v) => {
        const { value: val, label } =
          typeof v === 'string'
            ? {
                value: v,
                label: v
              }
            : v;
        const domId = `${name}--${val}`;

        return (
          <label className={styles.label} htmlFor={domId}>
            <input
              type="radio"
              className={styles.input}
              value={val}
              id={domId}
              defaultChecked={val === currentValue}
              {...rest}
            />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
}

export default RadioGroup;
