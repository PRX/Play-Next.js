/**
 * @file EmbedSettingsMenu.tsx
 * Provides player menu button that opens share modal.
 */

import type React from 'react';
import clsx from 'clsx';
import Modal, { IModalProps } from '@components/Modal/Modal';
import PlaybackRateControls from '@components/Player/PlaybackSpeedControls';
import SettingsMenuButton from '@components/Player/SettingsMenuButton';
import VolumeControls from '@components/Player/VolumeControls';
import VolumeUpIcon from '@svg/icons/VolumeUp.svg';
import PlaybackSpeedIcon from '@svg/icons/PlaybackSpeed.svg';
import styles from './EmbedSettingsMenu.module.scss';

export interface IEmbedSettingsMenuProps extends IModalProps {
  onOpen(): void;
  className?: string;
}

const EmbedSettingsMenu: React.FC<IEmbedSettingsMenuProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  className
}) => {
  const handleClick = () => {
    onOpen();
  };

  return (
    <>
      <SettingsMenuButton onClick={handleClick} />
      <Modal onClose={onClose} isOpen={isOpen} portalId={portalId}>
        <div className={clsx(styles.root, className)}>
          <div className={styles.setting}>
            <span className={styles.settingLabel}>
              <VolumeUpIcon />
              <span>Volume</span>
            </span>
            <span className={styles.settingControl}>
              <VolumeControls />
            </span>
          </div>
          <div className={styles.setting}>
            <span className={styles.settingLabel}>
              <PlaybackSpeedIcon />
              <span>Playback Speed</span>
            </span>
            <span className={styles.settingControl}>
              <PlaybackRateControls />
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmbedSettingsMenu;
