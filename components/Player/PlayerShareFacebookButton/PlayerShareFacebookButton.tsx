/**
 * @file PlayerShareFacebookButton.tsx
 * Button to open share link for Facebook for currently playing audio.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import ShareFacebookButton from '@components/ShareFacebookButton';

export interface IPlayerShareFacebookButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PlayerShareFacebookButton: React.FC<IPlayerShareFacebookButtonProps> = ({
  className
}) => {
  const { state } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = state;
  const { link } = tracks[currentTrackIndex];

  return <ShareFacebookButton className={className} url={link} />;
};

export default PlayerShareFacebookButton;
