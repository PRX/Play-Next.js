/**
 * @file ShareMenu.tsx
 * Provides player menu button that opens share modal.
 */

import type React from 'react';
import clsx from 'clsx';
import Modal, { IModalProps } from '@components/Modal/Modal';
import IconButton from '@components/IconButton';
import ShareIcon from '@svg/icons/Share.svg';
import ShareFacebookButton from '../ShareFacebookButton';
import ShareTwitterButton from '../ShareTwitterButton';
import ShareEmailButton from '../ShareEmailButton';
import styles from './ShareMenu.module.scss';

export interface IShareMenuProps extends IModalProps {
  onOpen(): void;
  className?: string;
  url?: string;
  twitterTitle?: string;
  emailSubject?: string;
  emailBody?: string;
}

const ShareMenu: React.FC<IShareMenuProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  url,
  twitterTitle,
  emailSubject,
  emailBody,
  className
}) => {
  const handleClick = () => {
    onOpen();
  };

  return (
    <>
      <IconButton
        type="button"
        className={clsx(className)}
        onClick={handleClick}
        title="Share"
      >
        <ShareIcon />
      </IconButton>
      <Modal onClose={onClose} isOpen={isOpen} portalId={portalId}>
        <nav className={styles.nav}>
          <ShareFacebookButton url={url} />

          <ShareTwitterButton url={url} text={twitterTitle} />

          <ShareEmailButton url={url} subject={emailSubject} body={emailBody} />
        </nav>
      </Modal>
    </>
  );
};

export default ShareMenu;
