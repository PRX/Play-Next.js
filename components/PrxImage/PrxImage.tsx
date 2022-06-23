/**
 * @file PrxImage.tsx
 * Component to render Next.js image component for trusted src URL domains.
 */

import type React from 'react';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import isTrustedImageDomain from '@lib/validate/isTrustedImageDomain';
import styles from './PrxImage.module.scss';

export interface IPrxImageProps extends ImageProps {}

const renderImage = ({
  src,
  alt,
  priority,
  layout,
  lazyRoot,
  objectFit,
  ...other
}: IPrxImageProps) => {
  if (layout !== 'raw')
    return (
      <div className={styles.wrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.image}
          src={src as string}
          alt={alt}
          style={{ objectFit }}
          {...other}
        />
      </div>
    );

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src as string} alt={alt} {...other} />;
};

const PrxImage: React.FC<IPrxImageProps> = ({
  src,
  alt,
  priority,
  layout,
  lazyRoot,
  ...other
}) => {
  const isUrlString = typeof src === 'string';
  const isTrusted = isUrlString && isTrustedImageDomain(src as string);
  const nextImageProps = {
    lazyRoot,
    priority,
    layout
  };

  return isTrusted || !isUrlString ? (
    <Image src={src} alt={alt} {...nextImageProps} {...other} />
  ) : (
    renderImage({
      src,
      alt,
      layout,
      ...other
    })
  );
};

export default PrxImage;
