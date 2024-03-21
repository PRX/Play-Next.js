/**
 * @file FollowMenu.tsx
 * Provides button and modal to display closed captions when audio has captions text tracks.
 */

import type React from 'react';
import { useContext } from 'react';
import clsx from 'clsx';
import Modal, { type IModalProps } from '@components/Modal/Modal';
import IconButton from '@components/IconButton';
import PlayerContext from '@contexts/PlayerContext';
import ClosedCaptionIcon from '@svg/icons/ClosedCaption.svg';

export interface IClosedCaptionDialogProps extends IModalProps {
  onOpen(): void;
}

const ClosedCaptionsDialog: React.FC<IClosedCaptionDialogProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  className,
  children
}) => {
  const { audioElm } = useContext(PlayerContext);
  const hasCaptionsTextTracks = [...(audioElm?.textTracks || [])].find(
    (t) => t.kind === 'captions'
  );

  const handleClick = () => {
    onOpen();
  };

  if (!hasCaptionsTextTracks) return null;

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
      <Modal onClose={onClose} isOpen={isOpen} portalId={portalId}>
        {children}
      </Modal>
    </>
  );
};

export default ClosedCaptionsDialog;
