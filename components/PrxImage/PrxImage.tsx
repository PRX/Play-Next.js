/**
 * @file PrxImage.tsx
 */

import React from 'react';
import Image, { ImageProps } from 'next/image';
import isTrustedImageDomain from '@lib/validate/isTrustedImageDomain';

const PrxImage: React.FC<ImageProps> = ({
  src,
  alt,
  priority,
  layout,
  ...other
}) => {
  const isUrlString = typeof src === 'string';
  const isTrusted = isUrlString && isTrustedImageDomain(src as string);

  return isTrusted || !isUrlString ? (
    <Image src={src} priority={priority} layout={layout} {...other} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...other} />
  );
};

export default PrxImage;
