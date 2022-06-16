/**
 * @file ShareEmailButton.tsx
 * Button to open share mailto link.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import MenuButton from '@components/MenuButton';
import EmailIcon from '@svg/icons/Email.svg';

export interface IShareEmailButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ShareEmailButton: React.FC<IShareEmailButtonProps> = ({ className }) => {
  const { state } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = state;
  const { link, title } = tracks[currentTrackIndex];
  const params = new URLSearchParams({
    subject: title,
    body: `Check out this podcast episode! ${link}`
  });
  const shareUrl = `mailto:?${params}`;

  return (
    <MenuButton
      className={className}
      action="link"
      label="Share via email"
      type="button"
      linkHref={shareUrl}
    >
      <EmailIcon />
    </MenuButton>
  );
};

export default ShareEmailButton;
