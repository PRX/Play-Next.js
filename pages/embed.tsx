/**
 * @file e.tsx
 * Exports the Embed page component.
 */

import type { GetServerSideProps } from 'next';
import type { IEmbedData } from '@interfaces/data';
import type { IEmbedConfig } from '@interfaces/embed/IEmbedConfig';
import { useReducer, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import parseEmbedParamsToConfig from '@lib/parse/config/parseEmbedParamsToConfig';
import fetchRssFeed from '@lib/fetch/rss/fetchRssFeed';
import parseEmbedData from '@lib/parse/data/parseEmbedData';
import {
  embedInitialState,
  embedStateReducer
} from '@states/embed/Embed.reducer';
import { EmbedActionTypes } from '@states/embed/Embed.actions';
import generateEmbedHtml from '@lib/generate/html/generateEmbedHtml';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import Modal from '@components/Modal';
import PlayButton from '@components/Player/PlayButton';
import PlayerProgress from '@components/Player/PlayerProgress';
import MenuButton from '@components/MenuButton';
import IconButton from '@components/IconButton';
import CopyLinkButton from '@components/Player/CopyLinkButton';
import ShareFacebookButton from '@components/Player/ShareFacebookButton';
import ShareTwitterButton from '@components/Player/ShareTwitterButton';
import ShareEmailButton from '@components/Player/ShareEmailButton';
import PrxLogo from '@svg/prx-logo.svg';
import MoreHorizIcon from '@svg/icons/MoreHoriz.svg';
import CloseIcon from '@svg/icons/Close.svg';
import AddIcon from '@svg/icons/Add.svg';
import ShareIcon from '@svg/icons/Share.svg';
import FavoriteIcon from '@svg/icons/Favorite.svg';
import CodeIcon from '@svg/icons/Code.svg';
import styles from '@styles/Embed.module.scss';

// Define dynamic component imports.
const PlayerText = dynamic(() => import('@components/Player/PlayerText'));
const ReplayButton = dynamic(() => import('@components/Player/ReplayButton'));
const ForwardButton = dynamic(() => import('@components/Player/ForwardButton'));
const Player = dynamic(() => import('@components/Player'));
const CoverArt = dynamic(() => import('@components/Player/CoverArt'));
const PlayerThumbnail = dynamic(
  () => import('@components/Player/PlayerThumbnail')
);
const Playlist = dynamic(() => import('@components/Player/Playlist/Playlist'));
const PreviousButton = dynamic(
  () => import('@components/Player/PreviousButton')
);
const NextButton = dynamic(() => import('@components/Player/NextButton'));

export interface IEmbedPageProps {
  config: IEmbedConfig;
  data: IEmbedData;
}

const EmbedPage = ({ config, data }: IEmbedPageProps) => {
  const { showCoverArt, showPlaylist, accentColor, theme } = config;
  const { audio, playlist, bgImageUrl } = data;
  const { imageUrl } = audio || {};
  const [state, dispatch] = useReducer(embedStateReducer, embedInitialState);
  const { shareShown, followShown, supportShown } = state;
  const [showMenu, setShowMenu] = useState(false);
  const menuShownClass = clsx({ [styles.menuShown]: showMenu });
  const coverArtImage = imageUrl || bgImageUrl;
  const canShowCoverArt = showCoverArt && coverArtImage;
  const canShowPlaylist = !!(showPlaylist && playlist?.length);
  const currentTrackIndex = playlist?.findIndex(
    (track) => track.guid === audio.guid
  );
  const mainClasses = clsx(styles.main, {
    [styles.withCoverArt]: canShowCoverArt,
    [styles.withPlaylist]: canShowPlaylist
  });
  const embedHtml = generateEmbedHtml(config);
  const rootStyles = [
    ...(accentColor
      ? [
          `--accent-color:${accentColor[0].split(' ')[0]};`,
          ...(accentColor.length > 1
            ? [`--accent-gradient: ${accentColor.join(',')};`]
            : [])
        ]
      : [])
  ].join('');

  const handleMoreButtonClick = () => {
    setShowMenu(!showMenu);
  };

  const handleFollowButtonClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_SHOW_FOLLOW_DIALOG });
  };

  const handleFollowCloseClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_HIDE_FOLLOW_DIALOG });
  };

  const handleShareButtonClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_SHOW_SHARE_DIALOG });
  };

  const handleShareCloseClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_HIDE_SHARE_DIALOG });
  };

  const handleSupportButtonClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_SHOW_SUPPORT_DIALOG });
  };

  const handleSupportCloseClick = () => {
    dispatch({ type: EmbedActionTypes.EMBED_HIDE_SUPPORT_DIALOG });
  };

  return (
    <>
      <ThemeVars theme="EmbedTheme" cssProps={styles} />

      <Head>
        <title>PRX Play - Embeddable Player</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <style>{`:root {${rootStyles}}`}</style>
      </Head>
      <div className={styles.container} data-theme={theme}>
        <div className={mainClasses}>
          {audio && (
            <Player
              audio={playlist || audio}
              startIndex={currentTrackIndex}
              imageUrl={bgImageUrl}
            >
              {canShowCoverArt && (
                <div className={styles.coverArt}>
                  <CoverArt />
                </div>
              )}

              <div className={styles.playerContainer}>
                <div className={styles.background}>
                  <PrxImage
                    src={bgImageUrl}
                    layout="fill"
                    objectFit="cover"
                    aria-hidden
                    priority
                  />
                </div>

                <div className={styles.playerMain}>
                  {!canShowCoverArt && (
                    <div className={styles.thumbnail}>
                      <PlayerThumbnail
                        sizes={`(min-width: 500px) ${styles['--player-thumbnail-size']}, ${styles['--player-thumbnail-size--mobile']}`}
                      />
                    </div>
                  )}

                  <div className={styles.text}>
                    <PlayerText />
                  </div>

                  <div className={styles.logo}>
                    {/* TODO: Get PRX text to line up with title baseline. */}
                    <PrxLogo className={styles.logoPrx} />
                  </div>

                  <div className={styles.menuToggle}>
                    <IconButton
                      type="button"
                      className={clsx(styles.iconButton, styles.moreButton)}
                      onClick={handleMoreButtonClick}
                    >
                      {!showMenu ? (
                        <MoreHorizIcon aria-label="Show menu" />
                      ) : (
                        <CloseIcon aria-label="Close menu" />
                      )}
                    </IconButton>
                  </div>

                  <div className={styles.panel}>
                    <div className={clsx(styles.controls, menuShownClass)}>
                      {canShowPlaylist && (
                        <PreviousButton
                          className={clsx(styles.button, styles.previousButton)}
                          disabled={currentTrackIndex === 1}
                        />
                      )}

                      <ReplayButton
                        className={clsx(styles.button, styles.replayButton)}
                      />

                      <PlayButton
                        className={clsx(styles.button, styles.playButton)}
                      />

                      <ForwardButton
                        className={clsx(styles.button, styles.replayButton)}
                      />

                      {canShowPlaylist && (
                        <NextButton
                          className={clsx(styles.button, styles.nextButton)}
                          disabled={currentTrackIndex === playlist.length - 1}
                        />
                      )}
                    </div>

                    <div className={clsx(styles.menu, menuShownClass)}>
                      {/* TODO: Replace content with dialog menu buttons. */}
                      <IconButton
                        type="button"
                        className={clsx(styles.menuButton, styles.followButton)}
                        onClick={handleFollowButtonClick}
                      >
                        <AddIcon aria-label="Follow" />
                      </IconButton>

                      <IconButton
                        type="button"
                        className={clsx(styles.menuButton, styles.shareButton)}
                        onClick={handleShareButtonClick}
                      >
                        <ShareIcon aria-label="Share" />
                      </IconButton>

                      <IconButton
                        type="button"
                        className={clsx(
                          styles.menuButton,
                          styles.supportButton
                        )}
                        onClick={handleSupportButtonClick}
                      >
                        <FavoriteIcon aria-label="Support" />
                      </IconButton>
                    </div>
                  </div>

                  <div className={styles.progress}>
                    <PlayerProgress />
                  </div>
                </div>
              </div>

              {canShowPlaylist && (
                <div className={styles.playlist}>
                  <Playlist style={{ height: '100%' }} />
                </div>
              )}

              {shareShown && (
                <Modal onClose={handleShareCloseClick}>
                  <nav className={styles.modalMenu}>
                    <ShareFacebookButton />

                    <ShareTwitterButton />

                    <ShareEmailButton />

                    <CopyLinkButton />

                    <MenuButton
                      action="clipboard"
                      clipboardText={embedHtml}
                      label="Embed Code"
                    >
                      <CodeIcon />
                    </MenuButton>
                  </nav>
                </Modal>
              )}
            </Player>
          )}

          {followShown && (
            <Modal onClose={handleFollowCloseClick}>Follow Menu</Modal>
          )}

          {supportShown && (
            <Modal onClose={handleSupportCloseClick}>Support Menu</Modal>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // 1. Convert query params into embed config.
  const config = parseEmbedParamsToConfig(query);
  // 2. If RSS feed URL is provided.
  const rssData = config.feedUrl && (await fetchRssFeed(config.feedUrl));
  // 3. Parse config and RSS data into embed data.
  const data = parseEmbedData(config, rssData);

  return {
    props: { config, data }
  };
};

export default EmbedPage;
