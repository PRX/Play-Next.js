/**
 * @file ThemeVars.tsx
 * Injects a theme's custom CSS properties into `:root`.
 */

import Portal from '@components/Portal';
import type React from 'react';

export interface IThemeVarsProps {
  theme: string;
  cssProps: { [key: string]: string };
}

const ThemeVars: React.FC<IThemeVarsProps> = ({
  cssProps: vars,
  theme: key
}) => {
  const cssVars = Object.entries(vars)
    // Filter for props custom CSS properties.
    .filter(([k]) => /^--/.test(k))
    // Convert key/value pairs to css property strings.
    .map(([cp, value]) => `${cp}: ${value};`);
  const hasCssVars = cssVars.length || null;
  const wrapperId = `ThemeVars:${key}`;

  return (
    hasCssVars && (
      <Portal wrapperId={wrapperId} prependToBody>
        <style>{`:root {\n  ${cssVars.join('\n  ')}\n}`}</style>
      </Portal>
    )
  );
};

export default ThemeVars;
