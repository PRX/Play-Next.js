/**
 * @file PlayerShareEmailButton.tsx
 * Button to open share mailto link for currently playing audio.
 */

import type React from 'react';
import { useContext } from 'react';
import PlayerContext from '@contexts/PlayerContext';
import ShareEmailButton from '@components/ShareEmailButton';

export interface IPlayerShareEmailButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PlayerShareEmailButton: React.FC<IPlayerShareEmailButtonProps> = ({
  className
}) => {
  const { state } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = state;
  const { link, title } = tracks[currentTrackIndex];
  const params = {
    className,
    url: link,
    subject: title,
    body: `Check out this podcast episode! ${link}`
  };

  return <ShareEmailButton {...params} />;
};

export default PlayerShareEmailButton;
