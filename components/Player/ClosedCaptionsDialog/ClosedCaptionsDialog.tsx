/**
 * @file FollowMenu.tsx
 * Provides button and modal to display closed captions when audio has captions text tracks.
 */

import type React from 'react';
import clsx from 'clsx';
import Modal, { type IModalProps } from '@components/Modal/Modal';
import IconButton from '@components/IconButton';
import ClosedCaptionIcon from '@svg/icons/ClosedCaption.svg';

export interface IClosedCaptionDialogProps extends IModalProps {
  onOpen(): void;
  modalClassName?: string;
}

const ClosedCaptionsDialog: React.FC<IClosedCaptionDialogProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  className,
  modalClassName,
  children
}) => {
  const handleClick = () => {
    onOpen();
  };

  return (
    <>
      <IconButton
        title="Closed Captions"
        type="button"
        className={clsx(className)}
        onClick={handleClick}
      >
        <ClosedCaptionIcon />
      </IconButton>
      {portalId && (
        <Modal
          className={modalClassName}
          onClose={onClose}
          isOpen={isOpen}
          portalId={portalId}
        >
          {children}
        </Modal>
      )}
    </>
  );
};

export default ClosedCaptionsDialog;
