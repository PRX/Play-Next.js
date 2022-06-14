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
  const rootRef = useRef<HTMLDivElement>();

  const handleClick = () => {
    onClose();
  };

  useEffect(() => {
    rootRef.current.focus();
    rootRef.current.blur();
  });

  return (
    <div className={styles.root}>
      <ThemeVars theme="Modal" cssProps={styles} />
      <IconButton
        ref={rootRef}
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
