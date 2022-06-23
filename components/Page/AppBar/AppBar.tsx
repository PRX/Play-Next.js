/**
 * @file AppBar.tsx
 * Component for logo bar at top of pages
 */

import PrxLogo from '@svg/prx-logo.svg';
import styles from './AppBar.module.scss';

const AppBar = () => (
  <div className={styles.root}>
    {/* Logo bar */}
    <PrxLogo className={styles.prxLogo} />
  </div>
);

export default AppBar;
