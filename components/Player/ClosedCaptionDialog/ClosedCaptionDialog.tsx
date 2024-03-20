/**
 * @file FollowMenu.tsx
 * Provides player menu button that opens follow modal when multiple follow URL's are provided.
 */

import type React from 'react';
import type { CSSProperties } from 'react';
import type { IAudioData } from '@interfaces/data';
import type { IRssPodcastTranscriptJson } from '@interfaces/data/IRssPodcast';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import clsx from 'clsx';
import Modal, { type IModalProps } from '@components/Modal/Modal';
import IconButton from '@components/IconButton';
import PlayerContext from '@contexts/PlayerContext';
import ClosedCaptionIcon from '@svg/icons/ClosedCaption.svg';
import RssFeedIcon from '@svg/icons/RssFeed.svg';
import PlayButton from '../PlayButton';
import PlayerProgress from '../PlayerProgress';
import ReplayButton from '../ReplayButton';
import ForwardButton from '../ForwardButton';
import styles from './ClosedCaptionDialog.module.scss';

export interface IClosedCaptionDialogProps extends IModalProps {
  onOpen(): void;
  speakerColors?: string[];
}

const optionsMap: Map<string, any> = new Map();
optionsMap.set('rss', { IconComponent: RssFeedIcon, label: 'RSS Feed' });

const ClosedCaptionDialog: React.FC<IClosedCaptionDialogProps> = ({
  onOpen,
  onClose,
  isOpen,
  portalId,
  className,
  speakerColors
}) => {
  const { audioElm, state } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = state;
  const [currentTime, setCurrentTime] = useState(audioElm?.currentTime || 0);
  const [currentCue, setCurrentCue] = useState<VTTCue>();
  const [cueEnded, setCueEnded] = useState(false);
  const [transcriptData, setTranscriptData] =
    useState<IRssPodcastTranscriptJson>();
  const currentTrack = tracks[currentTrackIndex] || ({} as IAudioData);
  const { transcripts } = currentTrack;
  const transcriptJson = transcripts?.find((t) => t.type.includes('json'));
  const captionsClassNames = clsx(styles.captions, {
    [styles.ended]: cueEnded
  });
  const [, speaker, caption] =
    currentCue?.text.replace('\n', ' ').match(/^(?:<v\s+([^>]+)>)?(.+)/) || [];
  const speakers = useRef(new Set<string>());

  if (speaker) {
    speakers.current.add(speaker);
  }

  const speakerNumber = [...speakers.current].indexOf(speaker);
  const speakerColor =
    speakerNumber > -1
      ? speakerColors?.[speakerNumber] ||
        `hsl(${35 + 81 * speakerNumber}, 100%, 50%)`
      : null;

  const cueSegments = useMemo(
    () =>
      transcriptData?.segments.filter(
        ({ startTime, endTime, speaker: _speaker }) =>
          !!currentCue &&
          _speaker === speaker &&
          startTime >= currentCue.startTime &&
          endTime <= currentCue.endTime
      ),
    [transcriptData?.segments, currentCue, speaker]
  );

  const handleClick = () => {
    onOpen();
  };

  const handleCueEnd = () => {
    setCueEnded(true);
  };

  const handleCueChange = useMemo(
    () => () => {
      const textTrack = [...(audioElm?.textTracks || [])].find(
        (track) => track.mode === 'showing'
      );

      [...(textTrack.activeCues || [])].forEach((c: VTTCue) => {
        // console.log(c.text, c);

        currentCue?.removeEventListener('exit', handleCueEnd);
        c.addEventListener('exit', handleCueEnd);

        setCueEnded(false);
        setCurrentCue(c);
      });
    },
    [audioElm?.textTracks, currentCue]
  );

  const handleUpdate = useCallback(() => {
    setCurrentTime(audioElm?.currentTime);
  }, [audioElm?.currentTime]);

  /**
   * Setup audio element event handlers.
   */
  useEffect(() => {
    audioElm?.addEventListener('timeupdate', handleUpdate);

    [...(audioElm?.textTracks || [])].forEach((track) => {
      if (track.kind === 'captions') {
        track.addEventListener('cuechange', handleCueChange);
      }
    });

    return () => {
      audioElm?.removeEventListener('timeupdate', handleUpdate);

      [...(audioElm?.textTracks || [])].forEach((track) => {
        if (track.kind === 'captions') {
          track.removeEventListener('cuechange', handleCueChange);
        }
      });
    };
  }, [audioElm, handleCueChange, handleUpdate]);

  useEffect(() => {
    if (!transcriptJson?.url) return;

    (async () => {
      const jsonData = await fetch(
        transcriptJson.url
      ).then<IRssPodcastTranscriptJson>((resp) => resp.ok && resp.json());

      setTranscriptData(jsonData);
    })();
  }, [transcriptJson?.url]);

  if (!transcripts) return null;

  return (
    <>
      <IconButton
        title="Closed Captions"
        type="button"
        className={clsx(className)}
        onClick={handleClick}
      >
        <ClosedCaptionIcon />
      </IconButton>
      <Modal onClose={onClose} isOpen={isOpen} portalId={portalId}>
        <div
          className={styles.root}
          style={{ '--cc-speaker--color': speakerColor } as CSSProperties}
        >
          <div className={captionsClassNames} aria-hidden>
            {currentCue && (
              <>
                {speaker && <cite className={styles.speaker}>{speaker}</cite>}
                <p className={styles.caption} key={currentCue.id}>
                  {(!cueSegments || cueSegments.length <= 1) && caption}
                  {cueSegments?.length > 1 &&
                    cueSegments?.map(({ startTime, body }, index) => (
                      <span
                        className={clsx(styles.segment, {
                          [styles.spoken]: startTime <= currentTime
                        })}
                        key={`${body}:${startTime}`}
                      >
                        {body.length > 1 && !!index && ' '}
                        {body}
                      </span>
                    ))}
                </p>
              </>
            )}
          </div>
          <div className={styles.footer}>
            <div className={styles.controls}>
              <ReplayButton />
              <PlayButton />
              <ForwardButton />
            </div>
            <PlayerProgress />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ClosedCaptionDialog;
