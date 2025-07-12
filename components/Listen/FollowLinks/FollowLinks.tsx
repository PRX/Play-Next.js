/**
 * @file FollowLinks.tsx
 * Component to list episodes on listen page.
 */

import type React from 'react';
import type { IRssPodcastFollowLink } from '@interfaces/data';
import root from 'react-shadow';
import clsx from 'clsx';
import serviceAssetsMap from '@config/ServiceAssetsMap';
import styles from './FollowLinks.module.scss';

export interface IFollowLinksProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  links: IRssPodcastFollowLink[];
}

const FollowLinks: React.FC<IFollowLinksProps> = ({
  className,
  links,
  ...props
}) => {
  if (!links || links?.length <= 1) return null;

  const followLinks = [...links.slice(0, -1)];
  const badgeLinks = followLinks.splice(0);
  // const {
  //   service: badgeService,
  //   href: badgeHref,
  //   text: badgeText
  // } = followLinks.shift() || {};
  // const { BadgeComponent, label: badgeLabel } =
  //   serviceAssetsMap.get(badgeService);

  return (
    <div className={clsx(styles.root, className)} {...props}>
      <div className={styles.inner}>
        {/* <a
        className={styles.badgeLink}
        href={badgeHref}
        target="_blank"
        rel="noreferrer"
      >
        <BadgeComponent aria-label={`Listen on ${badgeText || badgeLabel}`} />
      </a> */}

        {badgeLinks.map(({ service, href, text }) => {
          const { BadgeComponent, label } = serviceAssetsMap.get(service);
          return (
            <a
              className={styles.badgeLink}
              href={href}
              target="_blank"
              rel="noreferrer"
              key={`${service}:${href}`}
            >
              <root.div>
                <BadgeComponent aria-label={`Listen on ${text || label}`} />
              </root.div>
            </a>
          );
        })}
        {followLinks.map(({ service, href, text }) => {
          const { IconComponent, label } = serviceAssetsMap.get(service);
          return (
            <a
              className={styles.iconLink}
              href={href}
              target="_blank"
              rel="noreferrer"
              key={`${service}:${href}`}
            >
              <root.div>
                <IconComponent
                  aria-label={`Listen on ${text || label}`}
                  width={40}
                  height={40}
                />
              </root.div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default FollowLinks;
