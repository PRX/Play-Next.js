import type React from 'react';
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import PlayerContext from '@contexts/PlayerContext';
import PlayIcon from '@svg/icons/PlayArrow.svg';
import PauseIcon from '@svg/icons/Pause.svg';
import styles from './VideoUIWrapper.module.scss';

export interface IVideoUIWrapperProps extends React.ComponentProps<'div'> {}

const VideoUIWrapper = forwardRef<HTMLDivElement, IVideoUIWrapperProps>(
  ({ children, ...props }: IVideoUIWrapperProps, ref) => {
    const { state: playerState, togglePlayPause } = useContext(PlayerContext);
    const { playing } = playerState;
    const [isShown, setIsShown] = useState(true);
    const shownTimeout = useRef<ReturnType<typeof window.setTimeout>>(null);

    const showUI = useCallback(() => {
      if (shownTimeout.current) {
        clearTimeout(shownTimeout.current);
      }

      if (!playing) return;

      shownTimeout.current = setTimeout(() => {
        setIsShown(false);
      }, 5000);

      setIsShown(true);
    }, [playing]);

    const handlePointerMove = useCallback(() => {
      showUI();
    }, [showUI]);

    const handleClick = useCallback(() => {
      if (!isShown) return;

      togglePlayPause();
    }, [isShown, togglePlayPause]);

    useEffect(() => {
      if (playing) {
        showUI();
      } else {
        if (shownTimeout.current) {
          clearTimeout(shownTimeout.current);
        }
        setIsShown(true);
      }
    }, [playing, showUI]);

    return (
      <div
        {...props}
        ref={ref}
        data-shown={isShown}
        data-playing={playing}
        onPointerMove={handlePointerMove}
        onTouchEnd={handlePointerMove}
      >
        <button
          type="button"
          className={styles.playStateOverlay}
          onClick={handleClick}
        >
          <span className={styles.playStateIndicator} aria-hidden="true">
            {playing ? <PlayIcon /> : <PauseIcon />}
          </span>
        </button>
        {children}
      </div>
    );
  }
);

export default VideoUIWrapper;
