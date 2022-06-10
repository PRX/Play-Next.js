/**
 * @file ClipboardButton.tsx
 * Play button component to toggle playing state of player.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import clsx from 'clsx';
import styles from './ClipboardButton.module.scss';

export interface IClipboardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  format?: string;
  label: string;
  component?: React.FC<any>;
}

/**
 * Fallback button component.
 * @param props
 * @returns
 */
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  // eslint-disable-next-line react/button-has-type
  <button {...props}>{children}</button>
);

const ClipboardButton: React.FC<IClipboardButtonProps> = ({
  className,
  children,
  component,
  text,
  format,
  label,
  ...props
}) => {
  const ButtonComponent = component || Button;
  const buttonRef = useRef<HTMLButtonElement>();
  const promptRef = useRef<HTMLButtonElement>();
  const [copiedClass, setCopiedClass] = useState<string>();
  const [promptHoverClass, setPromptHoverClass] = useState<string>();
  const promptId = `prompt: ${label}`;
  const prompt = `${!copiedClass ? 'Copy' : 'Copied'} ${label}`;
  const classNames = clsx(className, styles.root, {
    [styles.copied]: !!copiedClass
  });
  const promptClasses = clsx(styles.prompt, promptHoverClass, copiedClass);
  const promptTimeout = useRef(null);

  const clearPromptTimeout = () => {
    if (promptTimeout.current) {
      clearTimeout(promptTimeout.current);
      promptTimeout.current = null;
    }
  };

  const handlePromptAnimationEnd = useCallback((e: AnimationEvent) => {
    switch (e.animationName) {
      case styles.copiedStart:
        if (!promptTimeout.current) {
          promptTimeout.current = setTimeout(() => {
            setCopiedClass(styles.copiedEnd);
          }, 5000);
        }
        break;

      case styles.copiedEnd:
        setCopiedClass(null);
        promptRef.current?.removeEventListener(
          'animationend',
          handlePromptAnimationEnd
        );
        break;

      default:
      // Don't do anything by default.
    }
  }, []);

  const copyTextToClipboard = useCallback(() => {
    const result = copy(text, {
      format: format || 'text/plain'
    });

    if (result) {
      clearPromptTimeout();
      setCopiedClass(styles.copiedStart);
      promptRef.current?.addEventListener(
        'animationend',
        handlePromptAnimationEnd
      );
    }
  }, [format, handlePromptAnimationEnd, text]);

  const handleClick = useCallback(() => {
    copyTextToClipboard();
  }, [copyTextToClipboard]);

  const handlePointerEnter = useCallback((e: PointerEvent) => {
    if (!buttonRef.current || e.pointerType !== 'mouse') return;

    const rect = buttonRef.current.getBoundingClientRect();
    const hoveringRight = e.offsetX < rect.width / 2;

    setPromptHoverClass(hoveringRight ? styles.hoverRight : styles.hoverLeft);
  }, []);

  const handlePointerLeave = useCallback(() => {
    clearPromptTimeout();
    setPromptHoverClass(null);
    setCopiedClass(null);
  }, []);

  useEffect(() => {
    const btnRef = buttonRef.current;
    btnRef?.addEventListener('pointerenter', handlePointerEnter);
    btnRef?.addEventListener('pointerleave', handlePointerLeave);
    btnRef?.addEventListener('blur', handlePointerLeave);

    return () => {
      clearTimeout(promptTimeout.current);
      btnRef?.removeEventListener('mouseenter', handlePointerEnter);
      btnRef?.removeEventListener('pointerleave', handlePointerLeave);
      btnRef?.removeEventListener('blur', handlePointerLeave);
    };
  }, [handlePointerEnter, handlePointerLeave]);

  return (
    <span className={styles.root}>
      <ButtonComponent
        {...props}
        className={classNames}
        ref={buttonRef}
        onClick={handleClick}
        aria-describedby={promptId}
        aria-label={prompt}
      >
        {children}
      </ButtonComponent>
      <span ref={promptRef} id={promptId} className={promptClasses} aria-hidden>
        {prompt}
      </span>
    </span>
  );
};

export default ClipboardButton;
