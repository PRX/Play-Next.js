import type React from 'react';
import dynamic from 'next/dynamic';

type ServiceAssets = {
  IconComponent?: ReturnType<
    typeof dynamic<React.JSX.IntrinsicElements['svg']>
  >;
  BadgeComponent?: ReturnType<
    typeof dynamic<React.JSX.IntrinsicElements['svg']>
  >;
  label: string;
};

/**
 * Map of service name slugs to branding assets, such as label, icon, and
 * badges. Icons should be sized to work in IconButton components, which expect
 * square icons. Podcast subscription services should use an icon and badge from
 * `@svg/podcast-badges/` directory.
 *
 * Thank you to Nathan Gathright for compiling and sharing all the podcast
 * platform icons and badges!
 *
 * Check https://github.com/nathangathright/podcast-badges for updates.
 */
const serviceAssetsMap = new Map<string, ServiceAssets>();

serviceAssetsMap.set('amazon-music', {
  label: 'Amazon Music',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/amazonmusic.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/amazonmusic-dark.svg')
  )
});

serviceAssetsMap.set('antennapod', {
  label: 'Antennapod',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/antennapod.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/antennapod-dark.svg')
  )
});

serviceAssetsMap.set('anytime-player', {
  label: 'Anytime Player',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/anytimeplayer.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/anytimeplayer-dark.svg')
  )
});

serviceAssetsMap.set('apple-podcasts', {
  label: 'Apple Podcasts',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/apple.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/apple-dark.svg')
  )
});

serviceAssetsMap.set('breez', {
  label: 'Breez',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/breez.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/breez-dark.svg')
  )
});

serviceAssetsMap.set('bluesky', {
  label: 'Bluesky',
  IconComponent: dynamic(() => import('@svg/icons/brand/Bluesky.svg'))
});

serviceAssetsMap.set('castamatic', {
  label: 'Castamatic',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/castamatic.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/castamatic-dark.svg')
  )
});

serviceAssetsMap.set('castbox', {
  label: 'Castbox',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/castbox.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/castbox-dark.svg')
  )
});

serviceAssetsMap.set('castro', {
  label: 'Castro',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/castro.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/castro-dark.svg')
  )
});

serviceAssetsMap.set('curiocaster', {
  label: 'CurioCaster',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/curiocaster.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/curiocaster-dark.svg')
  )
});

serviceAssetsMap.set('deezer', {
  label: 'Deezer',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/deezer.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/deezer-dark.svg')
  )
});

serviceAssetsMap.set('facebook', {
  label: 'Facebook',
  IconComponent: dynamic(() => import('@svg/icons/brand/Facebook.svg'))
});

serviceAssetsMap.set('fountain', {
  label: 'Fountain',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/fountain.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/fountain-dark.svg')
  )
});

serviceAssetsMap.set('global-player', {
  label: 'Global Player',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/globalplayer.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/globalplayer-dark.svg')
  )
});

serviceAssetsMap.set('goodpods', {
  label: 'Goodpods',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/goodpods.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/goodpods-dark.svg')
  )
});

serviceAssetsMap.set('gpodder', {
  label: 'gPodder',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/gpodder.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/gpodder-dark.svg')
  )
});

serviceAssetsMap.set('hark', {
  label: 'Hark',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/hark.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/hark-dark.svg')
  )
});

serviceAssetsMap.set('iheart', {
  label: 'iHeartRadio',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/iheartradio.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/iheartradio-dark.svg')
  )
});

serviceAssetsMap.set('instagram', {
  label: 'Instagram',
  IconComponent: dynamic(() => import('@svg/icons/brand/Instagram.svg'))
});

serviceAssetsMap.set('ln-beats', {
  label: 'LN Beats',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/lnbeats.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/lnbeats-dark.svg')
  )
});

serviceAssetsMap.set('luminary', {
  label: 'Luminary',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/luminary.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/luminary-dark.svg')
  )
});

serviceAssetsMap.set('metacast', {
  label: 'Metacast',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/metacast.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/metacast-dark.svg')
  )
});

serviceAssetsMap.set('moon-fm', {
  label: 'Moon FM',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/moonfm.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/moonfm-dark.svg')
  )
});

serviceAssetsMap.set('overcast', {
  label: 'Overcast',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/overcast.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/overcast-dark.svg')
  )
});

serviceAssetsMap.set('pandora', {
  label: 'Pandora',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/pandora.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/pandora-dark.svg')
  )
});

serviceAssetsMap.set('player-fm', {
  label: 'Player FM',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/playerfm.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/playerfm-dark.svg')
  )
});

serviceAssetsMap.set('pocket-casts', {
  label: 'Pocket Casts',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/pocketcasts.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/pocketcasts-dark.svg')
  )
});

serviceAssetsMap.set('podbean', {
  label: 'Podbean',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/podbean.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/podbean-dark.svg')
  )
});

serviceAssetsMap.set('podcast-addict', {
  label: 'Podcast Addict',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/podcastaddict.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/podcastaddict-dark.svg')
  )
});

serviceAssetsMap.set('podcast-app', {
  label: 'Podcast App',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/podcastapp.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/podcastapp-dark.svg')
  )
});

serviceAssetsMap.set('podcast-guru', {
  label: 'Podcast Guru',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/podcastguru.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/podcastguru-dark.svg')
  )
});

serviceAssetsMap.set('podcast-republic', {
  label: 'Podcast Republic',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/podcastrepublic.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/podcastrepublic-dark.svg')
  )
});

serviceAssetsMap.set('podfriend', {
  label: 'Podfriend',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/podfriend.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/podfriend-dark.svg')
  )
});

serviceAssetsMap.set('podlp', {
  label: 'PodLP',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/podlp.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/podlp-dark.svg')
  )
});

serviceAssetsMap.set('podstation', {
  label: 'podStation',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/podstation.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/podstation-dark.svg')
  )
});

serviceAssetsMap.set('podurama', {
  label: 'Podurama',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/podurama.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/podurama-dark.svg')
  )
});

serviceAssetsMap.set('podverse', {
  label: 'Podverse',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/podverse.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/podverse-dark.svg')
  )
});

serviceAssetsMap.set('snipd', {
  label: 'Snipd',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/snipd.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/snipd-dark.svg')
  )
});

serviceAssetsMap.set('sonnet', {
  label: 'Sonnet',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/sonnet.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/sonnet-dark.svg')
  )
});

serviceAssetsMap.set('spotify', {
  label: 'Spotify',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/spotify.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/spotify-dark.svg')
  )
});

serviceAssetsMap.set('steno-fm', {
  label: 'Steno FM',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/stenofm.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/stenofm-dark.svg')
  )
});

serviceAssetsMap.set('tiktok', {
  label: 'TikTok',
  IconComponent: dynamic(() => import('@svg/icons/brand/TikTok.svg'))
});

serviceAssetsMap.set('truefans', {
  label: 'Truefans',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/truefans.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/truefans-dark.svg')
  )
});

serviceAssetsMap.set('tunein', {
  label: 'TuneIn',
  IconComponent: dynamic(() => import('@svg/podcast-badges/icons/tunein.svg')),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/tunein-dark.svg')
  )
});

serviceAssetsMap.set('twitter', {
  label: 'Twitter',
  IconComponent: dynamic(() => import('@svg/icons/brand/Twitter.svg'))
});

serviceAssetsMap.set('youtube', {
  label: 'Youtube',
  IconComponent: dynamic(() => import('@svg/icons/brand/Youtube.svg'))
});

serviceAssetsMap.set('youtube-music', {
  label: 'Youtube Music',
  IconComponent: dynamic(
    () => import('@svg/podcast-badges/icons/youtubemusic.svg')
  ),
  BadgeComponent: dynamic(
    () => import('@svg/podcast-badges/badges/youtubemusic-dark.svg')
  )
});

export default serviceAssetsMap;
