import '@styles/globals.scss';
import 'prismjs/themes/prism-tomorrow.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/png"
          href="https://media.prx.org/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="https://media.prx.org/favicon-32x32.png"
          sizes="32x32"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
