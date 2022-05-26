/**
 * @file PrxImage.tsx
 * Component to render Next.js image component for trusted src URL domains.
 */

import React from 'react';
import Image, { ImageProps } from 'next/image';
import isTrustedImageDomain from '@lib/validate/isTrustedImageDomain';

export interface IPrxImageProps extends ImageProps {}

const PrxImage: React.FC<IPrxImageProps> = ({
  src,
  alt,
  priority,
  layout,
  ...other
}) => {
  const isUrlString = typeof src === 'string';
  const isTrusted = isUrlString && isTrustedImageDomain(src as string);

  return isTrusted || !isUrlString ? (
    <Image src={src} alt={alt} priority={priority} layout={layout} {...other} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...other} />
  );
};

export default PrxImage;
