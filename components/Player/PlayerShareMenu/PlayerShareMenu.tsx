/**
 * @file PlayerShareMenu.tsx
 * Provides player menu button that opens share modal.
 */

import type React from 'react';
import clsx from 'clsx';
import Modal, { IModalProps } from '@components/Modal/Modal';
import MenuButton from '@components/MenuButton';
import IconButton from '@components/IconButton';
import ShareIcon from '@svg/icons/Share.svg';
import CodeIcon from '@svg/icons/Code.svg';
import PlayerShareFacebookButton from '../PlayerShareFacebookButton';
import PlayerShareTwitterButton from '../PlayerShareTwitterButton';
import PlayerShareEmailButton from '../PlayerShareEmailButton';
import CopyLinkButton from '../CopyLinkButton';
import styles from './PlayerShareMenu.module.scss';
import FileDownloadButton from '../FileDownloadButton';

export interface IPlayerShareMenuProps extends IModalProps {
  onOpen(): void;
  className?: string;
  embedHtml?: string;
  downloadable?: boolean;
}

const PlayerShareMenu: React.FC<IPlayerShareMenuProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  embedHtml,
  downloadable = true,
  className
}) => {
  const handleClick = () => {
    onOpen();
  };

  return (
    <>
      <IconButton
        title="Share"
        type="button"
        className={clsx(className)}
        onClick={handleClick}
      >
        <ShareIcon />
      </IconButton>
      <Modal onClose={onClose} isOpen={isOpen} portalId={portalId}>
        <nav className={styles.nav}>
          <PlayerShareFacebookButton />

          <PlayerShareTwitterButton />

          <PlayerShareEmailButton />

          <CopyLinkButton />

          {downloadable && <FileDownloadButton />}

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

export default PlayerShareMenu;
