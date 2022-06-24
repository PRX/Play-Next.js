/**
 * @file AppBar.tsx
 * Component for logo bar at top of pages
 */

import Head from 'next/head';
import PrxLogo from '@svg/prx-logo.svg';
import styles from './AppBar.module.scss';

const AppBar = () => (
  <div className={styles.root}>
    <Head>
      <style>{`body{background-color: ${styles.bodyColor}; }`}</style>
    </Head>

    <PrxLogo className={styles.prxLogo} />
  </div>
);

export default AppBar;
