/**
 * @file PrxImage.tsx
 * Component to render Next.js image component for trusted src URL domains.
 */

import type React from 'react';
import type { ImageProps } from 'next/image';
import { forwardRef } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import isTrustedImageDomain from '@lib/validate/isTrustedImageDomain';
import styles from './PrxImage.module.scss';

export interface IPrxImageProps extends ImageProps {}

const PrxImage = forwardRef<HTMLImageElement, IPrxImageProps>(
  ({ className, src, alt, fill, priority, onLoad, ...other }, ref) => {
    const isUrlString = typeof src === 'string';
    const isTrusted = isUrlString && isTrustedImageDomain(src as string);
    const imageClassNames = clsx(className, styles.image);
    const nextImageProps = {
      ref,
      className,
      fill,
      priority,
      onLoad
    };

    if (!src) return null;

    return isTrusted || !isUrlString ? (
      <Image src={src} alt={alt} {...nextImageProps} {...other} />
    ) : (
      (fill && (
        <div className={styles.wrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={ref}
            src={src as string}
            alt={alt}
            {...other}
            className={imageClassNames}
            onLoad={onLoad}
          />
        </div>
      )) || (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src as string}
          alt={alt}
          className={className}
          onLoad={onLoad}
          {...other}
        />
      )
    );
  }
);

export default PrxImage;
