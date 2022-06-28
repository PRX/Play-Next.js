/**
 *
 * file @Footer.tsx
 * Component for page footer
 */
import Styles from './Footer.module.scss';

const Footer = () => {
  console.log('not feet');
  return (
    <div className={Styles.footer}>
      <div className={Styles.footerLinks}>
        <h3>Company</h3>
        {/* <Link className={Styles.links}>TEXT TEXT TEXT</Link>
        <Link className={Styles.links}>TEXT TEXT TEXT</Link>
        <Link className={Styles.links}>TEXT TEXT TEXT</Link> */}
      </div>
    </div>
  );
};

export default Footer;
