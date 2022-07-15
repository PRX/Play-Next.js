/**
 * @file MebMonetized.tsx
 * Provides player menu button that opens share modal.
 */

import type React from 'react';
import { useCallback, useContext, useEffect, useRef } from 'react';
import Head from 'next/head';
import clsx from 'clsx';
import IconButton from '@components/IconButton';
import Modal, { IModalProps } from '@components/Modal/Modal';
import PlayerContext from '@contexts/PlayerContext';
import CoilLogo from '@svg/logos/brands/Coil.svg';
import MonetizationIcon from '@svg/icons/MonetizationOn.svg';
import styles from './WebMonetized.module.scss';

export interface IMebMonetizedProps extends IModalProps {
  onOpen(): void;
  paymentPointer: string;
  className?: string;
}

const MebMonetized: React.FC<IMebMonetizedProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  paymentPointer,
  className
}) => {
  const buttonRef = useRef<HTMLButtonElement>();
  const { state } = useContext(PlayerContext);
  const { playing } = state;
  const userHasMonetizationEnabled = !!(
    typeof document !== 'undefined' && document.monetization
  );
  const active = userHasMonetizationEnabled && playing;
  const buttonClasses = clsx(className, styles.button, {
    [styles.enabled]: userHasMonetizationEnabled,
    [styles.active]: active
  });

  const pulse = () => {
    // TODO: Remove timeout when monetizationprogress handler is added.
    setTimeout(() => {
      buttonRef.current.classList.add(styles.pulse);
    }, 1000);
  };

  const handleClick = () => {
    onOpen();
  };

  const handlePulseEnd = useCallback(
    (e: AnimationEvent) => {
      if (e.animationName === styles.pulse) {
        buttonRef.current.classList.remove(styles.pulse);
        if (playing) {
          pulse();
        }
      }
    },
    [playing]
  );

  useEffect(() => {
    if (playing) {
      pulse();
    }
  }, [playing]);

  useEffect(() => {
    buttonRef.current?.addEventListener('animationend', handlePulseEnd);
  }, [handlePulseEnd]);

  // Render nothing when no pointer is provided.
  // if (!paymentPointer) return null;

  return (
    <>
      <Head>
        {playing && <meta name="monetization" content={paymentPointer} />}
      </Head>
      <IconButton
        ref={buttonRef}
        type="button"
        className={buttonClasses}
        onClick={handleClick}
      >
        <MonetizationIcon aria-label="Web Monetization" />
      </IconButton>
      <Modal onClose={onClose} isOpen={isOpen} portalId={portalId}>
        {userHasMonetizationEnabled ? (
          <div className={styles.content}>
            <div className={styles.message}>
              <h4>This Podcast is Web-Monetized</h4>
              <p>
                Web Monetization is a proposed open web standard that allows
                browsers to pay websites. Support this podcast in real time as
                you listen. Visit a web monetization provider to learn more and
                set up your account.
              </p>
            </div>
            <div className={styles.divider} />
            <div className={styles.providers}>
              <h4>Web Monetization Providers</h4>
              <a href="https://coil.com" target="_blank" rel="noreferrer">
                <CoilLogo className={styles.provider} aria-label="Coil" />
              </a>
            </div>
          </div>
        ) : (
          <div className={styles.monetized}>
            <h4>Thank You For Your Support</h4>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MebMonetized;
