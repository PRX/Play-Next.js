/**
 * @file Portal.tsx
 * Wrapper component to render children using React portal.
 */

import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

function createWrapperAndAppendToBody(wrapperId) {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}

const Portal = ({ children, wrapperId = 'portal-wrapper' }) => {
  const [wrapperElement, setWrapperElement] = useState(null);

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let wrapperWasGenerated = false;

    // Create missing wrapper element. Flag that it was created by this hook.
    if (!element) {
      wrapperWasGenerated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }

    setWrapperElement(element);

    return () => {
      // Cleanup wrapper element if it was created by this hook.
      if (wrapperWasGenerated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  return wrapperElement && createPortal(children, wrapperElement);
};

export default Portal;
