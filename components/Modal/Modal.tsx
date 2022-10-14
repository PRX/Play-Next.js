/**
 *  @file Modal.tsx
 *  Modal component for displaying modal content.
 *
 */

import React, { useEffect, useRef } from 'react';
import ThemeVars from '@components/ThemeVars';
import IconButton from '@components/IconButton';
import Portal from '@components/Portal';
import CloseIcon from '@svg/icons/Close.svg';
import styles from './Modal.module.scss';

export interface IModalProps extends React.PropsWithChildren<{}> {
  isOpen: boolean;
  onClose: Function;
  portalId?: string;
}

const Modal: React.FC<IModalProps> = ({
  children,
  isOpen,
  onClose,
  portalId = 'modal-portal-wrapper'
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>();

  const handleClick = () => {
    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.code || event.key;
    if (key === 'Escape') {
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
      <div className={styles.root}>
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
