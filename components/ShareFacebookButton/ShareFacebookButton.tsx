/**
 * @file ShareFacebookButton.tsx
 * Button to open share link for Facebook.
 */

import type React from 'react';
import MenuButton from '@components/MenuButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';

export interface IShareFacebookButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  url: string;
}

const ShareFacebookButton: React.FC<IShareFacebookButtonProps> = ({
  className,
  url
}) => {
  const params = new URLSearchParams({
    u: url
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
