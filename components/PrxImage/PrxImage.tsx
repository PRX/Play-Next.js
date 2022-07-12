/**
 * @file PrxImage.tsx
 * Component to render Next.js image component for trusted src URL domains.
 */

import type React from 'react';
import type { ImageProps } from 'next/image';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import isTrustedImageDomain from '@lib/validate/isTrustedImageDomain';
import styles from './PrxImage.module.scss';

export interface IPrxImageProps extends ImageProps {}

const PrxImage = forwardRef<{ complete: boolean }, IPrxImageProps>(
  (
    {
      className,
      src,
      alt,
      priority,
      layout,
      lazyRoot,
      objectFit,
      onLoadingComplete,
      onLoad,
      ...other
    },
    ref
  ) => {
    const imageRef = useRef<HTMLImageElement>();
    const isUrlString = typeof src === 'string';
    const isTrusted = isUrlString && isTrustedImageDomain(src as string);
    const imageClassNames = clsx(className, styles.image);
    const nextImageProps = {
      className,
      priority,
      layout,
      lazyRoot,
      objectFit,
      onLoadingComplete
    };

    useImperativeHandle(ref, () => ({
      complete: imageRef.current?.complete
    }));

    return isTrusted || !isUrlString ? (
      <Image src={src} alt={alt} {...nextImageProps} {...other} />
    ) : (
      (layout !== 'raw' && (
        <div className={styles.wrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={src as string}
            alt={alt}
            style={{ objectFit }}
            onLoad={onLoad}
            {...other}
            className={imageClassNames}
          />
        </div>
        // eslint-disable-next-line @next/next/no-img-element
      )) || <img ref={imageRef} src={src as string} alt={alt} {...other} />
    );
  }
);

export default PrxImage;
