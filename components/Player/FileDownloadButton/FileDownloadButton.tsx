/**
 * @file FileDownloadButton.tsx
 * Downlown MP3 Button for embed player and browser pages
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import FileDownload from '@svg/icons/FileDownload.svg';
import MenuButton from '@components/MenuButton';

export interface IFileDownloadButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const FileDownloadButton: React.FC<IFileDownloadButtonProps> = ({
  className
}) => {
  const { state } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = state;
  const { url } = tracks[currentTrackIndex];

  return (
    <MenuButton
      className={className}
      action="link"
      label="Download Audio"
      type="button"
      linkHref={url}
    >
      <FileDownload />
    </MenuButton>
  );
};

export default FileDownloadButton;
