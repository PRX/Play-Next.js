/**
 * @file FollowMenu.tsx
 * Provides player menu button that opens follow modal when multiple follow URL's are provided.
 */

import type React from 'react';
import clsx from 'clsx';
import Modal, { IModalProps } from '@components/Modal/Modal';
import MenuButton from '@components/MenuButton';
import IconButton from '@components/IconButton';
import AddIcon from '@svg/icons/Add.svg';
import RssFeedIcon from '@svg/icons/RssFeed.svg';
import styles from './FollowMenu.module.scss';

export interface IFollowMenuProps extends IModalProps {
  onOpen(): void;
  className?: string;
  followUrls: { [key: string]: string };
}

const optionsMap: Map<string, any> = new Map();
optionsMap.set('rss', { IconComponent: RssFeedIcon, label: 'RSS Feed' });

const FollowMenu: React.FC<IFollowMenuProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  followUrls,
  className
}) => {
  const followUrlsEntries = Object.entries(followUrls || {});

  const handleClick = () => {
    onOpen();
  };

  if (!followUrlsEntries.length) return null;

  if (followUrlsEntries.length === 1) {
    const { IconComponent, label } = optionsMap.get(followUrlsEntries[0][0]);
    return (
      <IconButton
        type="button"
        className={clsx(className)}
        href={followUrlsEntries[0][1]}
      >
        <IconComponent aria-label={label} />
      </IconButton>
    );
  }

  return (
    <>
      <IconButton
        type="button"
        className={clsx(className)}
        onClick={handleClick}
      >
        <AddIcon aria-label="Follow" />
      </IconButton>
      <Modal onClose={onClose} isOpen={isOpen} portalId={portalId}>
        <nav className={styles.nav}>
          {followUrlsEntries.map(([key, url]) => {
            const { IconComponent, label } = optionsMap.get(key);
            return (
              <MenuButton action="link" label={label} linkHref={url} key={key}>
                <IconComponent aria-hidden />
              </MenuButton>
            );
          })}
        </nav>
      </Modal>
    </>
  );
};

export default FollowMenu;
