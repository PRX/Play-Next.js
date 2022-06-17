/**
 * @file ShareFacebookButton.tsx
 * Button to open share link for Facebook.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import MenuButton from '@components/MenuButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';

export interface IShareFacebookButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ShareFacebookButton: React.FC<IShareFacebookButtonProps> = ({
  className
}) => {
  const { state } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = state;
  const { link } = tracks[currentTrackIndex];
  const params = new URLSearchParams({
    u: link
  });
  const shareUrl = `http://www.facebook.com/sharer.php?${params}`;

  return (
    <MenuButton
      className={className}
      action="link"
      label="Share on Facebook"
      type="button"
      linkHref={shareUrl}
    >
      <FontAwesomeIcon icon={faFacebookF} />
    </MenuButton>
  );
};

export default ShareFacebookButton;
