/**
 * @file CopyLinkButton.tsx
 * Button to copy link for current track to clipboard.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import MenuButton from '@components/MenuButton';
import LinkIcon from '@svg/icons/Link.svg';

export interface ICopyLinkButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const CopyLinkButton: React.FC<ICopyLinkButtonProps> = ({ className }) => {
  const { state } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = state;
  const { link } = tracks[currentTrackIndex];

  if (!link) return null;

  return (
    <MenuButton
      className={className}
      action="clipboard"
      label="Link"
      type="button"
      clipboardText={link}
    >
      <LinkIcon />
    </MenuButton>
  );
};

export default CopyLinkButton;
