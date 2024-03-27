/**
 * @file Portal.tsx
 * Wrapper component to render children using React portal.
 */

import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type PortalProps = {
  children: React.ReactNode;
  wrapperId?: string;
  prependToBody?: boolean;
};

function createWrapperAndAppendToBody(
  wrapperId: string,
  prependToBody?: boolean
) {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperId);
  if (prependToBody) {
    document.body.prepend(wrapperElement);
  } else {
    document.body.appendChild(wrapperElement);
  }
  return wrapperElement;
}

const Portal = ({
  children,
  wrapperId = 'portal-wrapper',
  prependToBody
}: PortalProps) => {
  const [wrapperElement, setWrapperElement] = useState(null);

  useEffect(() => {
    let element = document.getElementById(wrapperId);
    let wrapperWasGenerated = false;

    // Create missing wrapper element. Flag that it was created by this hook.
    if (!element) {
      wrapperWasGenerated = true;
      element = createWrapperAndAppendToBody(wrapperId, prependToBody);
    }

    setWrapperElement(element);

    return () => {
      // Cleanup wrapper element if it was created by this hook.
      if (wrapperWasGenerated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [prependToBody, wrapperId]);

  return wrapperElement && createPortal(children, wrapperElement, wrapperId);
};

export default Portal;
