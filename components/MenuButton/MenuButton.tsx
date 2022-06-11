/**
 * @file MenuButton.tsx
 * Button for use in modal menus.
 */

import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import clsx from 'clsx';
import IconButton from '@components/IconButton';
import styles from './MenuButton.module.scss';

export type MenuButtonAction = 'link' | 'clipboard';

export interface IMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action: MenuButtonAction;
  label: string;
  clipboardText?: string;
  clipboardFormat?: string;
  linkHref?: string;
}

const MenuButton: React.FC<IMenuButtonProps> = ({
  action,
  children,
  className,
  clipboardFormat,
  clipboardText,
  label,
  linkHref,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>();
  const promptRef = useRef<HTMLButtonElement>();
  const [copiedClass, setCopiedClass] = useState<string>();
  const [promptHoverClass, setPromptHoverClass] = useState<string>();
  const promptId = `prompt: ${label}`;
  const formatPrompt = () => {
    switch (action) {
      case 'clipboard':
        return `${!copiedClass ? 'Copy' : 'Copied'} ${label}`;

      default:
        return label;
    }
  };
  const prompt = formatPrompt();
  const classNames = clsx(className, styles.root, {
    [styles.copied]: !!copiedClass
  });
  const promptClasses = clsx(styles.prompt, promptHoverClass, copiedClass);
  const promptTimeout = useRef(null);

  // TODO: Move to ModalButton
  const clearPromptTimeout = () => {
    if (promptTimeout.current) {
      clearTimeout(promptTimeout.current);
      promptTimeout.current = null;
    }
  };

  // TODO: Move to ModalButton
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
    const result = copy(clipboardText, {
      format: clipboardFormat || 'text/plain'
    });

    // TODO: This can be done in a onCopy callback.
    if (result) {
      clearPromptTimeout();
      setCopiedClass(styles.copiedStart);
      promptRef.current?.addEventListener(
        'animationend',
        handlePromptAnimationEnd
      );
    }
  }, [clipboardFormat, handlePromptAnimationEnd, clipboardText]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      switch (action) {
        case 'clipboard':
          copyTextToClipboard();
          break;

        default:
          // TODO: Open link in new target.
          break;
      }

      if (typeof onClick === 'function') {
        onClick(e);
      }
    },
    [action, copyTextToClipboard, onClick]
  );

  const handlePointerEnter = useCallback((e: PointerEvent) => {
    if (!buttonRef.current || e.pointerType !== 'mouse') return;

    console.log(buttonRef.current);

    const rect = buttonRef.current.getBoundingClientRect();
    const hoveringRight = e.offsetX < rect.width / 2;

    setPromptHoverClass(hoveringRight ? styles.hoverRight : styles.hoverLeft);
  }, []);

  const handlePointerLeave = useCallback(() => {
    clearPromptTimeout();
    setPromptHoverClass(null);
    setCopiedClass(null);
  }, []);

  const actionProps =
    action === 'clipboard'
      ? {
          onClick: handleClick
        }
      : {
          href: linkHref,
          onClick
        };

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
      <IconButton
        {...props}
        {...actionProps}
        ref={buttonRef}
        className={classNames}
        aria-describedby={promptId}
        aria-label={prompt}
      >
        {children}
      </IconButton>
      <span ref={promptRef} id={promptId} className={promptClasses} aria-hidden>
        {prompt}
      </span>
    </span>
  );
};

export default MenuButton;
