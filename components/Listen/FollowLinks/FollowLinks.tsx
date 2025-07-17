/**
 * @file FollowLinks.tsx
 * Component to list episodes on listen page.
 */

import type React from 'react';
import type { IRssPodcastFollowLink } from '@interfaces/data';
import { useEffect, useRef } from 'react';
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
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRootRef = rootRef.current;
    const currentInnerRef = innerRef.current;
    const firstItem = currentInnerRef?.children[0];
    const resolvedInnerRefStyleMap = window?.getComputedStyle(currentInnerRef);

    /**
     * Handle mouse move even in root element.
     * Should not fire on touch deices.
     * @param e Mouse Event
     */
    function handleMouseMove(e: MouseEvent) {
      const { scrollWidth } = currentRootRef;
      const paddingInlineStart = parseFloat(
        resolvedInnerRefStyleMap.paddingInlineStart
      );
      const paddingInlineEnd = parseFloat(
        resolvedInnerRefStyleMap.paddingInlineEnd
      );
      const { width, left } = currentRootRef.getBoundingClientRect();
      const { width: firstItemWidth } = firstItem.getBoundingClientRect();
      const scrollRatio =
        // Delay scrolling by inline start padding an width of first item.
        (e.x - left - paddingInlineStart - firstItemWidth) /
        // Adjust total width by all in line padding and width of first item.
        (width - paddingInlineStart - paddingInlineEnd - firstItemWidth);

      currentRootRef.scrollLeft =
        Math.max(0, scrollWidth - width) * scrollRatio;
    }

    currentRootRef?.addEventListener('mousemove', handleMouseMove);

    return () => {
      currentRootRef.removeEventListener('wheel', handleMouseMove);
    };
  }, []);

  if (!links || links?.length <= 1) return null;

  const followLinks = [...links.slice(0, -1)];
  // TODO: If having all badges is not desired, add logic to adjust number of
  // badges shown. Maybe n badges when total badges greater than is n+3, else
  // all badges.
  const badgeLinks = followLinks.splice(0);

  return (
    <div className={clsx(styles.root, className)} {...props} ref={rootRef}>
      <div className={styles.inner} ref={innerRef}>
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
