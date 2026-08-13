/**
 * @file VideoOverlay.tsx
 * Component for audio player controls in listen page footer.
 */

import type { IMediaData } from '@interfaces/data';
import { forwardRef, useContext, useEffect, useRef } from 'react';
import clsx from 'clsx';
import ThemeVars from '@components/ThemeVars';
import ListenContext from '@contexts/ListenContext';
import PlayerContext from '@contexts/PlayerContext';
import listenStyles from '@components/Listen/Listen.module.scss';
import IconButton from '@components/IconButton';
import PlayButton from '@components/Player/PlayButton';
import Button from '@components/Button';
import { ListenActionTypes } from '@states/listen/Listen.actions';
import CloseIcon from '@svg/icons/Close.svg';
import MovieIcon from '@svg/icons/Movie.svg';
import MovieOffIcon from '@svg/icons/MovieOff.svg';
import PipIcon from '@svg/icons/Pip.svg';
import PipExitIcon from '@svg/icons/PipExit.svg';
import styles from './VideoOverlay.module.scss';

export interface IVideoOverlayProps {}

const VideoOverlay = forwardRef<HTMLDivElement, IVideoOverlayProps>(
  (props, ref) => {
    const trackRef = useRef<HTMLTrackElement>(null);
    const { state: listenState, dispatch: listenDispatch } =
      useContext(ListenContext);
    const { closedCaptionsShown, videoVisibility } = listenState;
    const { el, state: playerState } = useContext(PlayerContext);
    const { currentTrackIndex, tracks, playing } = playerState;
    const isVideoHidden = videoVisibility === 'hidden';
    const currentTrack = tracks[currentTrackIndex];
    const {
      guid,
      transcripts,
      duration,
      imageUrl,
      sources,
      hasVideoSourceAt = false
    } = (currentTrack || {}) as IMediaData;
    const transcript = transcripts?.find(
      (t) =>
        !!['vtt', 'srt', 'x-subrip', 'json'].find((n) => t.type.includes(n))
    );
    const hasVideo = hasVideoSourceAt !== false;
    const videoSource = hasVideo && sources?.[hasVideoSourceAt];
    const trackIsVideo = !!currentTrack && hasVideo;
    const useVideoElement = trackIsVideo;
    const isShown = !!currentTrack && trackIsVideo && !isVideoHidden;

    const handleCloseClick = () => {
      listenDispatch({
        type: ListenActionTypes.LISTEN_VIDEO_VISIBILITY_HIDDEN
      });
    };

    const handleShowVideoClick = () => {
      listenDispatch({
        type: ListenActionTypes.LISTEN_VIDEO_VISIBILITY_VISIBLE
      });
    };

    const handleToggleVideoClick = () => {
      listenDispatch({
        type: ListenActionTypes.LISTEN_VIDEO_VISIBILITY_TOGGLE
      });
    };

    const handlePipExitClick = () => {
      listenDispatch({
        type: ListenActionTypes.LISTEN_VIDEO_VIEW_DEFAULT
      });
    };

    const handlePipClick = () => {
      listenDispatch({
        type: ListenActionTypes.LISTEN_VIDEO_VIEW_PIP
      });
    };

    useEffect(() => {
      if (!useVideoElement || !el.current?.textTracks?.[0]) return;
      el.current.textTracks[0].mode = closedCaptionsShown
        ? 'showing'
        : 'disabled';
    }, [el, closedCaptionsShown, useVideoElement]);

    return (
      <div
        className={clsx(listenStyles.videoOverlay, styles.root)}
        data-shown={isShown}
        data-paused={!playing}
      >
        <ThemeVars theme="Listen VideoOverlay" cssProps={styles} />

        <Button
          className={styles.showVideoButton}
          onClick={handleShowVideoClick}
        >
          <MovieIcon />
          <span>Show Video</span>
        </Button>

        <Button
          className={styles.toggleVideoButton}
          onClick={handleToggleVideoClick}
        >
          {isShown ? (
            <>
              <MovieOffIcon />
              <span>Hide Video</span>
            </>
          ) : (
            <>
              <MovieIcon />
              <span>Show Video</span>
            </>
          )}
        </Button>

        <div className={styles.wrapper} ref={ref}>
          {useVideoElement && (
            <videojs-video
              preload={playing ? 'auto' : 'none'}
              src={videoSource.url}
              poster={imageUrl}
              ref={el}
              key={guid}
            >
              {transcript && (
                <track
                  ref={trackRef}
                  kind="captions"
                  src={`/api/proxy/transcript/vtt?u=${transcript.url}&cb=${duration}`}
                  key={transcript.url}
                />
              )}
            </videojs-video>
          )}

          <div className={clsx(styles.controlsOverlay)}>
            <div className={styles.controlsTop}>
              <IconButton
                className={styles.closeButton}
                onClick={handleCloseClick}
                title="Hide video"
              >
                <CloseIcon />
              </IconButton>
            </div>
            <div className={styles.controlsCenter}>
              <PlayButton className={styles.playButton} />
            </div>
            <div className={styles.controlsBottom}>
              <IconButton
                className={styles.pipButton}
                onClick={handlePipClick}
                title="Shrink video"
              >
                <PipIcon />
              </IconButton>
              <IconButton
                className={styles.pipExitButton}
                onClick={handlePipExitClick}
                title="Enlarge video"
              >
                <PipExitIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default VideoOverlay;
