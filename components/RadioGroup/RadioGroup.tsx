/**
 * @file RadioGroup.tsx
 * Basic radio group component.
 */

import type React from 'react';
import clsx from 'clsx';
import styles from './RadioGroup.module.scss';

export type RadioGroupOption =
  | string
  | {
      value: string;
      label?: string;
      labelProps?: React.JSX.IntrinsicElements['label'];
    };

export type RadioGroupProps = React.JSX.IntrinsicElements['input'] & {
  options: RadioGroupOption[];
};

function RadioGroup({
  className,
  options,
  defaultValue,
  value,
  ...rest
}: RadioGroupProps) {
  const { name } = rest;
  const inputValue = value || defaultValue;
  const cleanValue = Array.isArray(inputValue) ? inputValue[0] : inputValue;

  return (
    <div className={clsx(styles.root, className)}>
      {options.map((v) => {
        const {
          value: val,
          label,
          labelProps = {}
        } = typeof v === 'string'
          ? {
              value: v,
              label: v
            }
          : v;
        const { className: labelClassName, ...labelPropsRest } = labelProps;
        const labelText = label || val;
        const domId = `${name}--${labelText}--${val}`;

        return (
          <label
            {...labelPropsRest}
            className={clsx(styles.label, labelClassName)}
            htmlFor={domId}
            key={domId}
          >
            <input
              type="radio"
              className={styles.input}
              value={val}
              id={domId}
              checked={val === cleanValue}
              {...rest}
            />
            <span>{labelText}</span>
          </label>
        );
      })}
    </div>
  );
}

export default RadioGroup;
