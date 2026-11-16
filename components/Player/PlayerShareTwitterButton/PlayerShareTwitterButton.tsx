/**
 * @file ShareTwitterButton.tsx
 * Button to open share link for Twitter for the currently playing audio.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import ShareTwitterButton from '@components/ShareTwitterButton';

export interface IPlayerShareTwitterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PlayerShareTwitterButton: React.FC<IPlayerShareTwitterButtonProps> = ({
  className
}) => {
  const { state } = useContext(PlayerContext);
  const { currentTrack } = state;
  const { link, title } = currentTrack || {};

  return <ShareTwitterButton className={className} url={link} text={title} />;
};

export default PlayerShareTwitterButton;
