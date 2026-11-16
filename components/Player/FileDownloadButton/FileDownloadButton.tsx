/**
 * @file FileDownloadButton.tsx
 * Download MP3 Button for embed player and browser pages
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
  const { currentTrack } = state;
  const { sources, hasAudioSourceAt } = currentTrack || {};
  const hasAudioSource = hasAudioSourceAt !== false;
  const audioSource = hasAudioSource && sources[hasAudioSourceAt];
  const { url } = audioSource || {};

  return (
    url && (
      <MenuButton
        className={className}
        action="link"
        label="Download Audio"
        type="button"
        linkHref={url}
      >
        <FileDownload />
      </MenuButton>
    )
  );
};

export default FileDownloadButton;
