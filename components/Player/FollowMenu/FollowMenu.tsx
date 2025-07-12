/**
 * @file FollowMenu.tsx
 * Provides player menu button that opens follow modal when multiple follow URL's are provided.
 */

import type React from 'react';
import type { IRssPodcastFollowLink } from '@interfaces/data';
import clsx from 'clsx';
import Modal, { IModalProps } from '@components/Modal/Modal';
import MenuButton from '@components/MenuButton';
import IconButton from '@components/IconButton';
import serviceAssetsMap from '@config/ServiceAssetsMap';
import AddIcon from '@svg/icons/Add.svg';
import RssFeedIcon from '@svg/icons/RssFeed.svg';
import styles from './FollowMenu.module.scss';

export interface IFollowMenuProps extends IModalProps {
  onOpen(): void;
  className?: string;
  followLinks: IRssPodcastFollowLink[];
}

serviceAssetsMap.set('rss', { IconComponent: RssFeedIcon, label: 'RSS Feed' });

const getInitials = (name: string) => {
  const initials = [...(name?.matchAll(/\b\w/g) || [])].join('').toUpperCase();

  return initials;
};

const FollowMenu: React.FC<IFollowMenuProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  followLinks,
  className
}) => {
  const handleClick = () => {
    onOpen();
  };

  if (!followLinks?.length) return null;

  if (followLinks.length === 1) {
    const { href, text, service } = followLinks[0];
    const { IconComponent, label } = serviceAssetsMap.get(service) || {
      IconComponent: 'span'
    };

    return (
      <IconButton
        title={text || label}
        type="button"
        className={clsx(className)}
        href={href}
      >
        <IconComponent aria-hidden>{getInitials(text || label)}</IconComponent>
      </IconButton>
    );
  }

  return (
    <>
      <IconButton
        title="Follow Podcast..."
        type="button"
        className={clsx(className)}
        onClick={handleClick}
      >
        <AddIcon aria-hidden />
      </IconButton>
      <Modal onClose={onClose} isOpen={isOpen} portalId={portalId}>
        <h2 className={styles.heading}>Follow This Podcast</h2>
        <nav className={styles.nav}>
          {followLinks.map(({ href, text, service }) => {
            const { IconComponent, label } = serviceAssetsMap.get(service) || {
              IconComponent: 'span'
            };
            return (
              <MenuButton
                action="link"
                label={text || label}
                linkHref={href}
                key={`${service}:${href}`}
              >
                <IconComponent aria-hidden>
                  {getInitials(text || label)}
                </IconComponent>
              </MenuButton>
            );
          })}
        </nav>
      </Modal>
    </>
  );
};

export default FollowMenu;
