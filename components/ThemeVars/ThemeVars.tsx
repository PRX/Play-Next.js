/**
 * @file ThemeVars.tsx
 * Injects a theme's custom CSS properties into `:root`.
 */

import type React from 'react';
import Head from 'next/head';

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

  return (
    hasCssVars && (
      <Head>
        <style key={`ThemeVars:${key}`}>{`:root {\n  ${cssVars.join(
          '\n  '
        )}\n}`}</style>
      </Head>
    )
  );
};

export default ThemeVars;
