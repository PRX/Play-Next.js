/**
 * @file FollowMenu.tsx
 * Provides button and modal to display closed captions when audio has captions text tracks.
 */

import type React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import Modal, { type IModalProps } from '@components/Modal/Modal';
import IconButton from '@components/IconButton';
import PlayerContext from '@contexts/PlayerContext';
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
  const { audioElm } = useContext(PlayerContext);
  const [hasTextTracks, setHasTextTrack] = useState(false);

  const handleClick = () => {
    onOpen();
  };

  const handleTextTrackChange = useCallback(() => {
    setHasTextTrack(!!audioElm?.textTracks.length);
  }, [audioElm?.textTracks.length]);

  useEffect(() => {
    // FIX: Firefox doesn't initialize audio element tracks nor fires change events
    // on initial load. Update state after a timeout to detect if text tracks
    // exist on audio element.
    setTimeout(() => {
      handleTextTrackChange();
    }, 0);

    audioElm?.textTracks?.addEventListener('change', handleTextTrackChange);

    return () => {
      audioElm?.textTracks?.removeEventListener(
        'change',
        handleTextTrackChange
      );
    };
  }, [audioElm, handleTextTrackChange]);

  if (!hasTextTracks) return null;

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
      <Modal
        className={modalClassName}
        onClose={onClose}
        isOpen={isOpen}
        portalId={portalId}
      >
        {children}
      </Modal>
    </>
  );
};

export default ClosedCaptionsDialog;
