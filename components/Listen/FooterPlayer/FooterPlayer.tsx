/**
 * @file FooterPlayer.tsx
 * Component for audio player controls in listen page footer.
 */

import { forwardRef, useContext } from 'react';
import clsx from 'clsx';
import PrxImage from '@components/PrxImage';
import ThemeVars from '@components/ThemeVars';
import ListenContext from '@contexts/ListenContext';
import PlayerContext from '@contexts/PlayerContext';
import Marquee from '@components/Marquee';
import ClosedCaptionsDialog from '@components/Player/ClosedCaptionsDialog';
import ClosedCaptionsFeed from '@components/Player/ClosedCaptionsFeed';
import PreviousButton from '@components/Player/PreviousButton';
import NextButton from '@components/Player/NextButton';
import ReplayButton from '@components/Player/ReplayButton';
import PlayButton from '@components/Player/PlayButton';
import ForwardButton from '@components/Player/ForwardButton';
import PlayerProgress from '@components/Player/PlayerProgress';
import listenStyles from '@components/Listen/Listen.module.scss';
import { ListenActionTypes } from '@states/listen/Listen.actions';
import styles from './FooterPlayer.module.scss';

export interface IFooterPlayerProps {}

const FooterPlayer = forwardRef<HTMLDivElement, IFooterPlayerProps>(
  (props, ref) => {
    const {
      config,
      state: listenState,
      dispatch: listenDispatch
    } = useContext(ListenContext);
    const { closedCaptionsShown } = listenState;
    const { accentColor } = config;
    const { imageUrl: defaultThumbUrl, state: playerState } =
      useContext(PlayerContext);
    const { currentTrackIndex, tracks } = playerState;
    const isShown = currentTrackIndex !== null && currentTrackIndex >= 0;
    const currentTrack = tracks[currentTrackIndex];
    const { imageUrl, title, transcripts } = currentTrack || {};
    const showClosedCaptionsButton = !!transcripts?.length;
    const thumbSrc = imageUrl || defaultThumbUrl;
    const thumbSizes = [
      `(min-width: ${listenStyles.breakpointFull}) ${styles['--footerPlayer-thumbnail-size']}`,
      `${styles['--footerPlayer-thumbnail-size--mobile']}`
    ].join(',');

    console.log(transcripts);

    const handleClosedCaptionButtonClick = () => {
      listenDispatch({
        type: ListenActionTypes.LISTEN_PLAYER_TOGGLE_CLOSED_CAPTIONS_DIALOG_SHOWN
      });
    };

    const handleClosedCaptionCloseClick = () => {
      listenDispatch({
        type: ListenActionTypes.LISTEN_PLAYER_HIDE_CLOSED_CAPTIONS_DIALOG
      });
    };

    return (
      <>
        <ThemeVars theme="Listen FooterPlayer" cssProps={styles} />
        <div
          ref={ref}
          className={clsx(styles.root, {
            [styles.isShown]: isShown
          })}
          data-shown={isShown}
        >
          <div className={styles.thumbnail}>
            <PrxImage
              src={thumbSrc}
              alt={`Thumbnail for "${title}".`}
              layout="fill"
              sizes={thumbSizes}
            />
          </div>

          <div className={styles.info}>
            <div className={styles.title}>
              <Marquee>{title}</Marquee>
            </div>

            {showClosedCaptionsButton && (
              <ClosedCaptionsDialog
                className={clsx(
                  styles.menuButton,
                  styles.closedCaptionsButton,
                  {
                    [styles.closedCaptionsEnabled]: closedCaptionsShown
                  }
                )}
                modalClassName={styles.closedCaptionModal}
                onOpen={handleClosedCaptionButtonClick}
                onClose={handleClosedCaptionCloseClick}
                isOpen={closedCaptionsShown}
                portalId="listen-closed-caption-modal"
              >
                <ClosedCaptionsFeed speakerColors={accentColor} />
              </ClosedCaptionsDialog>
            )}
          </div>

          <div className={styles.controls}>
            {tracks.length > 1 && <PreviousButton />}
            <ReplayButton />
            <PlayButton />
            <ForwardButton />
            {tracks.length > 1 && <NextButton />}
          </div>

          <div className={styles.progress}>
            <PlayerProgress />
          </div>
        </div>
      </>
    );
  }
);

export default FooterPlayer;
