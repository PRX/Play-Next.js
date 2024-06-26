import type { NextPage } from 'next';
import Head from 'next/head';
import Prism from 'prismjs';
import styles from '@styles/Home.module.scss';
import PrxLogo from '@svg/logos/PRX-Logo-Horizontal-Color.svg';
import { useEffect } from 'react';

const Home: NextPage = () => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>PRX Play</title>
        <meta
          name="description"
          content="Play is a customizable audio embed player provided by PRX."
        />
      </Head>

      <main className={styles.main}>
        <header className={styles.header}>
          <PrxLogo className={styles.logo} />
          <h1 className={styles.title}>Play Documentation</h1>

          <nav className={styles.navigation}>
            <ul>
              <li>
                <a href="#getting-started">Getting Started</a>
              </li>
              <li>
                <a href="#configuration-parameters">Configuration Parameters</a>
                <ul>
                  <li>
                    <a href="#rss-parameters">
                      RSS Feed Source Embed Parameters
                    </a>
                  </li>
                  <li>
                    <a href="#audio-parameters">
                      Audio File Source Embed Players
                    </a>
                  </li>
                  <li>
                    <a href="#customization-parameters">
                      Customization Parameters
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#embed-examples">Embed Examples</a>
              </li>
            </ul>
          </nav>
        </header>

        <div className={styles.content}>
          <p>
            Play is a customizable audio embed player provided by PRX. It can
            play audio found in an RSS feed or a single audio file, and can be
            customized to fit your brand or site theme.
          </p>
          <h2>
            <a href="#getting-started" id="getting-started">
              Getting Started
            </a>
          </h2>
          <p>
            To get started, use either a public RSS feed URL in the{' '}
            <code className="language-markup">uf</code> parameter, or an audio
            file URL in the <code className="language-markup">ua</code>{' '}
            parameter.
          </p>
          <h6>Base Embed URL:</h6>
          <pre>
            <code className="language-markup">https://play.prx.org/e</code>
          </pre>
          <h6>Example:</h6>
          <pre>
            <code className="language-markup">
              {`<iframe
  src="https://play.prx.org/e?uf=https://example.com/rss/feed.xml"
  width="100%"
  height="200"
/>`}
            </code>
          </pre>
          <p>
            Note: Minimum height of your{' '}
            <code className="language-markup">&lt;iframe&gt;</code> should be
            200px.
          </p>
          <p>That is all you need to add the player to your page.</p>
          <h2>
            <a href="#configuration-parameters" id="configuration-parameters">
              Configuration Parameters
            </a>
          </h2>
          <p>
            When setting up your embed, choose which set of configuration
            parameters you want to use, and add them to the base embed URL path
            in an <code className="language-markup">&lt;iframe&gt;</code>{' '}
            element in your content. The embed URL supports the following query
            parameters:
          </p>
          <h3>
            <a href="#rss-parameters" id="rss-parameters">
              RSS Feed Source Embed Parameters
            </a>
          </h3>
          <h4>uf</h4>
          <p>
            Must be a complete URL to a valid RSS feed. Feed items must include{' '}
            <code className="language-markup">&lt;enclosure&gt;</code> elements
            containing links to the audio files to play. By default, the player
            will display information for, and play the audio for the first item
            in the feed. If your feed is a list of podcast episodes, and the
            items are in reverse order (newer episodes first) the embed will act
            as a latest episode player.
          </p>
          <h6>Example: </h6>
          <pre>
            <code className="language-markup">
              uf=https://example.com/rss/feed.xml
            </code>
          </pre>
          <h4>
            us <span className={styles.badge}>Optional</span>
          </h4>
          <p>
            Provide an alternate subscription RSS feed URL to use in the player
            menu if it differs from the{' '}
            <code className="language-markup">uf</code> feed URL.
          </p>
          <h6>Example </h6>
          <pre>
            <code className="language-markup">
              us=https://example.com/rss/subscribe-feed.xml
            </code>
          </pre>
          <h4>
            ge <span className={styles.badge}>Optional</span>
          </h4>
          <p>
            RSS item <code className="language-markup">guid</code> value.
            Selects which episode in the feed to initially use in the player.
            Keep in mind that if your feed has a capped length, ie. contains the
            latest 10 episodes, eventually the targeted guid could no longer be
            in the feed. When this happens, the player will fallback to playing
            the first item in the feed. To avoid this behavior, ensure you
            provide an uncapped feed URL in the{' '}
            <code className="language-markup">uf</code> parameter.
          </p>
          <h6>Example: </h6>
          <pre>
            <code className="language-markup">ge=0123456789abcdef</code>
          </pre>
          <h4>
            sp <span className={styles.badge}>Optional</span>
          </h4>
          <p>
            Shows a playlist of items in the feed. Value should be the number of
            items to show in the playlist, or{' '}
            <code className="language-markup">all</code> to show all items in
            the feed. Requires <code className="language-markup">uf</code>{' '}
            parameter. Be sure to change your embed&apos;s{' '}
            <code className="language-markup">&lt;iframe&gt;</code> height to
            600px or more to ensure playlist items are visible.
          </p>
          <h6>Examples:</h6>
          <ul>
            <li>
              <code className="language-markup">sp=10</code>
            </li>
            <li>
              <code className="language-markup">sp=25</code>
            </li>
            <li>
              <code className="language-markup">sp=all</code>
            </li>
          </ul>
          <h4>
            se <span className={styles.badge}>Optional</span>
          </h4>
          <p>
            Filter feed items to a specific season. Requires{' '}
            <code className="language-markup">uf</code> and{' '}
            <code className="language-markup">sp</code> parameters.
          </p>
          <h6>Example:</h6>
          <pre>
            <code className="language-markup">se=2</code>
          </pre>
          <h4>
            ct <span className={styles.badge}>Optional</span>
          </h4>
          <p>
            Filter feed items to a specific category. Requires{' '}
            <code className="language-markup">uf</code> and{' '}
            <code className="language-markup">sp</code> parameters.
          </p>
          <h6>Example:</h6>
          <pre>
            <code className="language-markup">ct=entertainment</code>
          </pre>
          <h3>
            <a href="#audio-parameters" id="audio-parameters">
              Audio File Source Embed Players
            </a>
          </h3>
          <h4>ua</h4>
          <p>
            File to play in the embed. Must be a complete URL to an audio file.
            When used with the <code className="language-markup">uf</code>{' '}
            parameter, this file will play instead of the audio of the RSS item.
            Has no effect when used with{' '}
            <code className="language-markup">sp</code> parameter.
          </p>
          <h6>Example:</h6>
          <pre>
            <code className="language-markup">
              ua=https://example.com/files/audio.mp3
            </code>
          </pre>
          <h4>tt</h4>
          <p>Title to display in player.</p>

          <h6>Example:</h6>
          <pre>
            <code className="language-markup">tt=My+Audio+Title</code>
          </pre>

          <h4>ts</h4>
          <p>Subtitle to display in player.</p>

          <h6>Example:</h6>
          <pre>
            <code className="language-markup">
              ts=Something+About+The+Audio
            </code>
          </pre>
          <h4>ue</h4>
          <p>Thumbnail image URL. Must be a complete URL to an image file.</p>

          <h6>Example:</h6>
          <pre>
            <code className="language-markup">
              ue=https://example.com/files/thumbnail.jpg
            </code>
          </pre>

          <h3>
            <a href="#customization-parameters" id="customization-parameters">
              Customization Parameters
            </a>
          </h3>
          <p>
            These parameters are supported by both the RSS Feed and Audio File
            embed players. All parameters are optional.
          </p>
          <h4>ui</h4>
          <p>
            Custom background image URL used in player. Must be a complete URL
            to an image file.
          </p>

          <h6>Example:</h6>
          <pre>
            <code className="language-markup">
              ui=https://example.com/files/background.jpg
            </code>
          </pre>

          <h4>ca</h4>
          <p>
            Enables a card style player, with a large thumbnail image above
            player controls. Be sure to wrap the embed{' '}
            <code className="language-markup">&lt;iframe&gt;</code> with a
            responsive wrapper{' '}
            <code className="language-markup">&lt;div&gt;</code> if you need the
            embed to scale responsively.
          </p>
          <h5>Responsive Card Wrapper Example</h5>
          <pre>
            <code className="language-markup">
              {`<div style="width: 100%; height: calc(100% + 200px); position: relative;">
  <iframe
    src="...&ca=1"
    style="position: absolute; inset: 0;"
  />
</div>`}
            </code>
          </pre>
          <p>
            When used with the <code className="language-markup">sp</code>{' '}
            parameter, increase the added pixel height of the wrapper to 800px
            or more.
          </p>
          <h5>Responsive Card Wrapper With Playlist Example</h5>
          <pre>
            <code className="language-markup">
              {`<div style="width: 100%; height: calc(100% + 800px); position: relative;">
  <iframe
    src="...&ca=1"
    style="position: absolute; inset: 0;"
  />
</div>`}
            </code>
          </pre>
          <h4>ac</h4>
          <p>
            Customize the accent color used in the player. Value must be a six
            or eight character hex color string. Do NOT include the{' '}
            <code className="language-markup">#</code> prefix.
          </p>
          <h6>Example:</h6>
          <ul>
            <li>
              Correct: <code className="language-markup">ac=c3e5f1</code>
            </li>
            <li>
              Incorrect: <code className="language-markup">ac=#c3e5f1</code>
            </li>
          </ul>
          <p>
            Providing multiple <code className="language-markup">ac</code>{' '}
            parameters will result in your accent colors used in a gradient. Add
            as many colors as you need. Want a rainbow progress bar? You can do
            that. Elements that don’t support a gradient will use the first
            accent color.
          </p>

          <h6>Gradient Examples:</h6>
          <pre>
            <code className="language-markup">
              ac=c3e5f1&ac=fe42a3&ac=e3d819
            </code>
          </pre>
          <p>
            Gradient colors are distributed evenly by default. Add a percentage
            to the hex color to set a start position of that color.
          </p>

          <h6>Gradient with Positioned Colors Examples:</h6>

          <pre>
            <code className="language-markup">
              ac=CF3350&ac=CF3350+45%&ac=E7F5E0+55%&ac=E7F5E0
            </code>
          </pre>

          <h4>th</h4>
          <p>Choose the color theme of the player. Value can be:</p>
          <ul>
            <li>
              <b>dark</b> - (default)
            </li>
            <li>
              <b>light</b>
            </li>
            <li>
              <b>auto</b> - Use the system color scheme of the user.
            </li>
          </ul>
          <h2>
            <a href="#embed-examples" id="embed-examples">
              Embed Examples
            </a>
          </h2>
          <h3>Basic RSS Player</h3>
          <pre>
            <code className="language-markup">
              {`<iframe
  src="https://play.prx.org/e?uf=https://example.com/rss/feed.xml"
  width="100%"
  height="200"
/>`}
            </code>
          </pre>
          <h3>Card Style RSS Player</h3>
          <h4>Fixed Size</h4>
          <pre>
            <code className="language-markup">
              {`<iframe
  src="https://play.prx.org/e?uf=https://example.com/rss/feed.xml&ca=1"
  width="500"
  height="700"
/>`}
            </code>
          </pre>
          <h4>Responsive</h4>
          <pre>
            <code className="language-markup">
              {`<div style="width: 100%; height: calc(100% + 200px); position: relative;">
  <iframe
    src="https://play.prx.org/e?uf=https://example.com/rss/feed.xml&ca=1"
    style="position: absolute; inset: 0;"
  />
</div>`}
            </code>
          </pre>
          <h3>RSS Playlist</h3>
          <pre>
            <code className="language-markup">
              {`<iframe
  src="https://play.prx.org/e?uf=https://example.com/rss/feed.xml&sp=20"
  width="100%"
  height="600"
/>`}
            </code>
          </pre>
          <h3>Basic Audio File Player</h3>
          <pre>
            <code className="language-markup">
              {`<iframe
  src="https://play.prx.org/e?ua=https://example.com/files/audio.mp3&tt=My+Audio&ts+Something+about+the+audio%ue=https://example.com/files/thumbnail.jpg&ui=https://example.com/files/background.jpg"
  width="100%"
  height="200"
/>`}
            </code>
          </pre>
        </div>
      </main>
    </div>
  );
};

export default Home;
