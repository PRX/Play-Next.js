/**
 *  @file Modal.tsx
 *  Modal component for displaying modal content.
 *
 */

import React from 'react';
import ThemeVars from '@components/ThemeVars';
import styles from './Modal.module.scss';
import CloseIcon from '@svg/icons/Close.svg';
import IconButton from '@components/IconButton';

export interface IModalProps extends React.PropsWithChildren<{}> {
  onClose: Function;
}

const Modal: React.FC<IModalProps> = ({ children, onClose }) => {
  const handleClick = () => {
    onClose();
  };

  return (
    <div className={styles.root}>
      <ThemeVars theme="Modal" cssProps={styles} />
      {children}

      <IconButton
        type="button"
        className={styles.closeButton}
        onClick={handleClick}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
};

export default Modal;
