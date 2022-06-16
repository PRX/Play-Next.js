/**
 *  @file Modal.tsx
 *  Modal component for displaying modal content.
 *
 */

import React, { useEffect, useRef } from 'react';
import ThemeVars from '@components/ThemeVars';
import IconButton from '@components/IconButton';
import CloseIcon from '@svg/icons/Close.svg';
import styles from './Modal.module.scss';

export interface IModalProps extends React.PropsWithChildren<{}> {
  onClose: Function;
}

const Modal: React.FC<IModalProps> = ({ children, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>();

  const handleClick = () => {
    onClose();
  };

  useEffect(() => {
    closeButtonRef.current.focus();
    closeButtonRef.current.blur();
  });

  return (
    <div className={styles.root}>
      <ThemeVars theme="Modal" cssProps={styles} />
      <IconButton
        ref={closeButtonRef}
        type="button"
        className={styles.closeButton}
        onClick={handleClick}
      >
        <CloseIcon />
      </IconButton>

      {children}
    </div>
  );
};

export default Modal;
