/**
 * @file SupportMenu.tsx
 * Provides player menu button that opens follow modal when multiple follow URL's are provided.
 */

import type React from 'react';
import clsx from 'clsx';
import Modal, { IModalProps } from '@components/Modal/Modal';
import MenuButton from '@components/MenuButton';
import IconButton from '@components/IconButton';
import FavoriteIcon from '@svg/icons/Favorite.svg';
import DonateIcon from '@svg/icons/VolunteerActivism.svg';
import styles from './SupportMenu.module.scss';

export interface ISupportMenuProps extends IModalProps {
  onOpen(): void;
  className?: string;
  supportUrls: { [key: string]: string };
}

const optionsMap: Map<string, any> = new Map();
optionsMap.set('donation', {
  IconComponent: DonateIcon,
  label: 'Make A Donation'
});

const SupportMenu: React.FC<ISupportMenuProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  supportUrls,
  className
}) => {
  const followUrlsEntries = Object.entries(supportUrls || {});

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
        <IconComponent title={label} />
      </IconButton>
    );
  }

  return (
    <>
      <IconButton
        title="Support Us"
        type="button"
        className={clsx(className)}
        onClick={handleClick}
      >
        <FavoriteIcon />
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

export default SupportMenu;
