/**
 *  @file Modal.tsx
 *  Modal component for displaying modal content.
 *
 */

import React from 'react';
import ThemeVars from '@components/ThemeVars';
import IconButton from '@components/IconButton';
import CloseIcon from '@svg/icons/Close.svg';
import styles from './Modal.module.scss';

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
