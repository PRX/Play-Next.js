/**
 * @file MebMonetized.tsx
 * Provides player menu button that opens share modal.
 */

import type React from 'react';
import type {
  MonetizationProgressEvent,
  MonetizationState,
  MonetizationProgressEventDetail
} from 'types-wm';
import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState
} from 'react';
import Head from 'next/head';
import clsx from 'clsx';
import Button from '@components/Button';
import IconButton from '@components/IconButton';
import Modal, { IModalProps } from '@components/Modal/Modal';
import PrxImage from '@components/PrxImage';
import PlayerContext from '@contexts/PlayerContext';
import MonetizationIcon from '@svg/icons/MonetizationOn.svg';
import styles from './WebMonetized.module.scss';

export interface IMebMonetizedProps extends IModalProps {
  onOpen(): void;
  paymentPointer: string;
  className?: string;
}

const StreamPip: React.FC<React.HTMLProps<SVGElement>> = ({ className }) => {
  const ref = useRef<HTMLSpanElement>();

  const handleAnimationEnd = (e: AnimationEvent) => {
    const pipIconSelector = `.${styles.pipIcon}`;
    const icon = ref.current.querySelector(pipIconSelector);
    const nextPipIcon =
      ref.current.nextElementSibling?.querySelector(pipIconSelector);

    switch (e.animationName) {
      case styles.pipBlipIn:
        icon.classList.remove(styles.blipIn);
        icon.classList.add(styles.blipOut);
        nextPipIcon?.classList.add(styles.blipIn);
        break;

      case styles.pipBlipOut:
        icon.classList.remove(styles.blipOut);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    ref.current.addEventListener('animationend', handleAnimationEnd);
  }, []);

  return (
    <span ref={ref} className={styles.pip} key={useId()}>
      <MonetizationIcon
        className={clsx(styles.pipIcon, className)}
        aria-hidden
      />
    </span>
  );
};

const MebMonetized: React.FC<IMebMonetizedProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  paymentPointer,
  className
}) => {
  const hasDocument = typeof document !== 'undefined';
  const buttonRef = useRef<HTMLButtonElement>();
  const pipStream = useRef<HTMLDivElement>();
  const { state, imageUrl } = useContext(PlayerContext);
  const { playing } = state;
  const [monetizationState, setMonetizationState] =
    useState<MonetizationState>();
  const [amountPaid, setAmountPaid] = useState(0);
  const [scale, setScale] = useState(1);
  const [currency, setCurrency] = useState('USD');
  const active = !!monetizationState && playing;
  const buttonClasses = clsx(className, styles.button, {
    [styles.enabled]: monetizationState,
    [styles.active]: active
  });
  const currencyFormatter = Intl.NumberFormat(undefined, {
    style: 'currency',
    currency
  });

  const formatAmountPaid = () => {
    const formatted = amountPaid * 10 ** -scale;

    return currencyFormatter.format(formatted);
  };

  const updateAmountPaid = useCallback(
    ({ amount, assetCode, assetScale }: MonetizationProgressEventDetail) => {
      if (amountPaid === 0) {
        setCurrency(assetCode);
        setScale(assetScale);
      }

      setAmountPaid(amountPaid + Number(amount));
    },
    [amountPaid]
  );

  const pulse = () => {
    setTimeout(() => {
      buttonRef.current?.classList.add(styles.pulse);
      pipStream.current
        ?.querySelector(`.${styles.pip}:first-child .${styles.pipIcon}`)
        .classList.add(styles.blipIn);
    }, 0);
  };

  const handleClick = () => {
    onOpen();
  };

  const handlePulseEnd = useCallback((e: AnimationEvent) => {
    if (e.animationName === styles.pulse) {
      buttonRef.current.classList.remove(styles.pulse);
    }
  }, []);

  const handleMonetizationStart = useCallback(() => {
    setMonetizationState(document.monetization.state);
  }, []);

  const handleMonetizationStop = useCallback(() => {
    setMonetizationState(document.monetization.state);
  }, []);

  const handleMonetizationProgress = useCallback(
    ({ detail }: MonetizationProgressEvent) => {
      updateAmountPaid(detail);
      pulse();
    },
    [updateAmountPaid]
  );

  useEffect(() => {
    if (playing) {
      pulse();
    }
  }, [playing]);

  useEffect(() => {
    buttonRef.current?.addEventListener('animationend', handlePulseEnd);

    if (monetizationState) {
      document.monetization.addEventListener(
        'monetizationstart',
        handleMonetizationStart
      );
      document.monetization.addEventListener(
        'monetizationstop',
        handleMonetizationStop
      );
      document.monetization.addEventListener(
        'monetizationprogress',
        handleMonetizationProgress
      );
    }
  }, [
    hasDocument,
    handleMonetizationProgress,
    handlePulseEnd,
    monetizationState,
    handleMonetizationStart,
    handleMonetizationStop
  ]);

  useEffect(() => {
    setMonetizationState(
      typeof document !== 'undefined' ? document.monetization?.state : undefined
    );
  }, []);

  // Render nothing when no pointer is provided.
  if (!paymentPointer) return null;

  return (
    <>
      <Head>
        {(true || playing) && (
          <meta name="monetization" content={paymentPointer} />
        )}
      </Head>
      <IconButton
        title="Web Monetization"
        ref={buttonRef}
        type="button"
        className={buttonClasses}
        onClick={handleClick}
      >
        <MonetizationIcon />
      </IconButton>
      <Modal onClose={onClose} isOpen={isOpen} portalId={portalId}>
        {!monetizationState ? (
          <div className={styles.content}>
            <div className={styles.message}>
              <h4>This Podcast is Web-Monetized</h4>
              <p>
                Web Monetization is a proposed open web standard that allows
                browsers to pay websites. Support this podcast in real time as
                you listen.
              </p>
            </div>
            <div className={styles.divider} />
            <div className={styles.providers}>
              <Button
                href="https://help.prx.org/hc/en-us/articles/9901810244251-How-can-I-set-up-micropayments-for-my-podcast"
                target="_blank"
              >
                Learn more
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.monetized}>
            <h4>Thank You For Your Support</h4>
            <div className={styles.paymentStream}>
              <div className={styles.paid}>
                <span className={styles.amount}>{formatAmountPaid()}</span>
                Total Paid
              </div>
              <div ref={pipStream} className={styles.stream}>
                {[...Array(8)].map((v, index) => (
                  <StreamPip
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                  />
                ))}
              </div>
              <div className={styles.thumbnail}>
                <PrxImage
                  src={imageUrl}
                  className={styles.thumbnailImage}
                  alt="Podcast thumbnail"
                  fill
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MebMonetized;
