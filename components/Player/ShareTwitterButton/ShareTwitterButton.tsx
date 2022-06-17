/**
 * @file ShareTwitterButton.tsx
 * Button to open share link for Twitter.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import MenuButton from '@components/MenuButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

export interface IShareTwitterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ShareTwitterButton: React.FC<IShareTwitterButtonProps> = ({
  className
}) => {
  const { state } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = state;
  const { link, title } = tracks[currentTrackIndex];
  const params = new URLSearchParams({
    url: link,
    text: title
  });
  const shareUrl = `https://twitter.com/share?${params}`;

  return (
    <MenuButton
      className={className}
      action="link"
      label="Share on Twitter"
      type="button"
      linkHref={shareUrl}
    >
      <FontAwesomeIcon icon={faTwitter} />
    </MenuButton>
  );
};

export default ShareTwitterButton;
