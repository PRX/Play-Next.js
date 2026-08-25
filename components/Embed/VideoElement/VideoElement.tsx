import type React from 'react';
import type { IMediaData } from '@interfaces/data';
import 'videojs-video-element';
import { forwardRef, useContext, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import PlayerContext from '@contexts/PlayerContext';
import styles from './VideoElement.module.scss';

export interface IVideoElementProps extends React.ComponentProps<'div'> {
  closedCaptionsShown: boolean;
}

const VideoElement = forwardRef<HTMLDivElement, IVideoElementProps>(
  ({ className, closedCaptionsShown, ...props }, ref) => {
    const trackRef = useRef<HTMLTrackElement>(null);
    const { el, state: playerState } = useContext(PlayerContext);
    const { currentTrackIndex, tracks, playing } = playerState;
    const currentTrack = tracks[currentTrackIndex];
    const {
      guid,
      transcripts,
      duration,
      imageUrl,
      sources,
      previewUrl,
      hasVideoSourceAt = false
    } = (currentTrack || {}) as IMediaData;
    const hasVideo = hasVideoSourceAt !== false;
    const videoSource = hasVideo && sources?.[hasVideoSourceAt];
    const transcript = transcripts?.find(
      (t) =>
        !!['vtt', 'srt', 'x-subrip', 'json'].find((n) => t.type.includes(n))
    );

    useEffect(() => {
      if (!videoSource || !el.current?.textTracks?.[0]) return;

      el.current.textTracks[0].mode = closedCaptionsShown
        ? 'showing'
        : 'disabled';
    }, [el, closedCaptionsShown, videoSource]);

    if (!videoSource) return null;

    return (
      <div className={clsx(styles.root, className)} {...props} ref={ref}>
        {imageUrl && (
          <div className={styles.backdropImage}>
            <Image src={imageUrl} alt="" fill objectFit="cover" />
          </div>
        )}
        <videojs-video
          preload={playing ? 'auto' : 'none'}
          src={previewUrl || videoSource.url}
          poster={imageUrl}
          ref={el}
          key={guid}
          disablepictureinpicture
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
      </div>
    );
  }
);

export default VideoElement;
