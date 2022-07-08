/**
 * @file ShareMenu.tsx
 * Provides player menu button that opens share modal.
 */

import type React from 'react';
import clsx from 'clsx';
import Modal, { IModalProps } from '@components/Modal/Modal';
import MenuButton from '@components/MenuButton';
import IconButton from '@components/IconButton';
import ShareIcon from '@svg/icons/Share.svg';
import CodeIcon from '@svg/icons/Code.svg';
import ShareFacebookButton from '../ShareFacebookButton';
import ShareTwitterButton from '../ShareTwitterButton';
import ShareEmailButton from '../ShareEmailButton';
import CopyLinkButton from '../CopyLinkButton';
import styles from './ShareMenu.module.scss';

export interface IShareMenuProps extends IModalProps {
  onOpen(): void;
  className?: string;
  embedHtml?: string;
}

const ShareMenu: React.FC<IShareMenuProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  embedHtml,
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
      >
        <ShareIcon aria-label="Share" />
      </IconButton>
      <Modal onClose={onClose} isOpen={isOpen} portalId={portalId}>
        <nav className={styles.nav}>
          <ShareFacebookButton />

          <ShareTwitterButton />

          <ShareEmailButton />

          <CopyLinkButton />

          {embedHtml && (
            <MenuButton
              action="clipboard"
              clipboardText={embedHtml}
              label="Embed Code"
            >
              <CodeIcon />
            </MenuButton>
          )}
        </nav>
      </Modal>
    </>
  );
};

export default ShareMenu;
