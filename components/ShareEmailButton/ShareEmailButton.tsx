/**
 * @file ShareEmailButton.tsx
 * Button to open share mailto link.
 */

import type React from 'react';
import MenuButton from '@components/MenuButton';
import EmailIcon from '@svg/icons/Email.svg';

export interface IShareEmailButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  url: string;
  subject?: string;
  body?: string;
}

const ShareEmailButton: React.FC<IShareEmailButtonProps> = ({
  className,
  url,
  subject,
  body
}) => {
  const params = new URLSearchParams({
    ...(subject && { subject }),
    body: body ? `${body} ${url}` : `Check out this link! ${url}`
  });
  const shareUrl = `mailto:?${params}`.replaceAll('+', ' ');

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
