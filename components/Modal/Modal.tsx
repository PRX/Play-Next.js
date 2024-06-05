/**
 *  @file Modal.tsx
 *  Modal component for displaying modal content.
 *
 */

import type React from 'react';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import ThemeVars from '@components/ThemeVars';
import IconButton from '@components/IconButton';
import Portal from '@components/Portal';
import CloseIcon from '@svg/icons/Close.svg';
import styles from './Modal.module.scss';

export interface IModalProps
  extends React.PropsWithChildren<{ className?: string }> {
  isOpen: boolean;
  onClose?(): void;
  portalId?: string;
}

const Modal: React.FC<IModalProps> = ({
  children,
  isOpen,
  onClose,
  portalId = 'modal-portal-wrapper',
  className
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>();

  const handleClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.code || event.key;
    if (key === 'Escape' && onClose) {
      onClose();
    }
  };

  useEffect(() => {
    closeButtonRef.current?.focus();
    closeButtonRef.current?.blur();

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return !isOpen ? null : (
    <Portal wrapperId={portalId}>
      <ThemeVars theme="Modal" cssProps={styles} />
      <div className={clsx(styles.root, className)}>
        <IconButton
          title="Close"
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={handleClick}
        >
          <CloseIcon />
        </IconButton>

        <div className={styles.content}>{children}</div>
      </div>
    </Portal>
  );
};

export default Modal;
