/**
 * @file Marquee.tsx
 * Component to display text, animating the text side-to-side when it overflows.
 */

import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './Marquee.module.scss';

export interface IMarqueeProps extends React.PropsWithChildren<{}> {}

const Marquee: React.FC<IMarqueeProps> = ({ children }) => {
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const [marqueeSpeed, setMarqueeSpeed] = useState(0);
  const contentRef = useRef(null);
  const rootRef = useRef(null);

  const updateMarqueeOffset = useCallback(() => {
    const rootRec = rootRef.current?.getBoundingClientRect();
    const contentRec = contentRef.current?.getBoundingClientRect();
    const offset = Math.min(Math.ceil(rootRec.width - contentRec.width), 0);
    const speed = Math.abs(offset / 200) * 5;

    setMarqueeOffset(offset);
    setMarqueeSpeed(speed);
  }, []);

  const handleResize = useCallback(() => {
    updateMarqueeOffset();
  }, [updateMarqueeOffset]);

  useEffect(() => {
    updateMarqueeOffset();

    setTimeout(() => {
      updateMarqueeOffset();
    }, 1000);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, updateMarqueeOffset, children]);

  return (
    <div className={styles.root} ref={rootRef}>
      <motion.div
        ref={contentRef}
        className={clsx(styles.content, {
          [styles.marqueeOn]: marqueeOffset < 0
        })}
        animate={{ x: [0, marqueeOffset] }}
        initial={{ x: 0 }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          repeatDelay: 0.5,
          delay: 1,
          duration: marqueeSpeed
          // ease: 'linear'
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Marquee;