/**
 * @file ShareTwitterButton.tsx
 * Button to open share link for Twitter.
 */

import type React from 'react';
import MenuButton from '@components/MenuButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';

export interface IShareTwitterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  url: string;
  text?: string;
}

const ShareTwitterButton: React.FC<IShareTwitterButtonProps> = ({
  className,
  url,
  text
}) => {
  if (!url) return null;

  const params = new URLSearchParams({
    url,
    ...(text && { text })
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
      <FontAwesomeIcon icon={faXTwitter} />
    </MenuButton>
  );
};

export default ShareTwitterButton;
