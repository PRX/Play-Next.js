const servicesDomainMap = new Map<string, string>();

servicesDomainMap.set('music.amazon.com', 'amazon-music');
servicesDomainMap.set('antennapod.org', 'antennapod');
servicesDomainMap.set('anytimeplayer.app', 'anytime-player');
servicesDomainMap.set('podcasts.apple.com', 'apple-podcasts');
servicesDomainMap.set('breez.link', 'breez');
servicesDomainMap.set('bsky.app', 'bluesky');
servicesDomainMap.set('castamatic.com', 'castamatic');
servicesDomainMap.set('castbox.fm', 'castbox');
servicesDomainMap.set('castro.fm', 'castro');
servicesDomainMap.set('curiocaster.com', 'curiocaster');
servicesDomainMap.set('deezer.com', 'deezer');
servicesDomainMap.set('facebook.com', 'facebook');
servicesDomainMap.set('fountain.fm', 'fountain');
servicesDomainMap.set('globalplayer.com', 'global-player');
servicesDomainMap.set('goodpods.com', 'goodpods');
servicesDomainMap.set('gpodder.net', 'gpodder');
servicesDomainMap.set('harkaudio.com', 'hark');
servicesDomainMap.set('iheart.com', 'iheart');
servicesDomainMap.set('instagram.com', 'instagram');
servicesDomainMap.set('lnbeats.com', 'ln-beats');
servicesDomainMap.set('luminarypodcasts.com', 'luminary');
servicesDomainMap.set('metacast.app', 'metacast');
servicesDomainMap.set('moon.fm', 'moon-fm');
servicesDomainMap.set('overcast.fm', 'overcast');
servicesDomainMap.set('pandora.com', 'pandora');
servicesDomainMap.set('player.fm', 'player-fm');
servicesDomainMap.set('pca.st', 'pocket-casts');
servicesDomainMap.set('podbean.com', 'podbean');
servicesDomainMap.set('podcastaddict.com', 'podcast-addict');
servicesDomainMap.set('podcast.app', 'podcast-app');
servicesDomainMap.set('app.podcastguru.io', 'podcast-guru');
servicesDomainMap.set('podcastrepublic.net', 'podcast-republic');
servicesDomainMap.set('podfriend.com', 'podfriend');
servicesDomainMap.set('podknife.com', 'podknife');
servicesDomainMap.set('link.podlp.app', 'podlp');
servicesDomainMap.set('podstation.github.io', 'podstation');
servicesDomainMap.set('podurama.com', 'podurama');
servicesDomainMap.set('api.podverse.fm', 'podverse');
servicesDomainMap.set('share.snipd.com', 'snipd');
servicesDomainMap.set('sonnet.fm', 'sonnet');
servicesDomainMap.set('open.spotify.com', 'spotify');
servicesDomainMap.set('steno.fm', 'steno-fm');
servicesDomainMap.set('tiktok.com', 'tiktok');
servicesDomainMap.set('truefans.fm', 'truefans');
servicesDomainMap.set('tunein.com', 'tunein');
servicesDomainMap.set('twitter.com', 'twitter');
servicesDomainMap.set('x.com', 'twitter');
servicesDomainMap.set('youtube.com', 'youtube');
servicesDomainMap.set('music.youtube.com', 'youtube-music');

/**
 * Map service URL's hostnames to service name slugs.
 *
 * @param url URL provided by service for subscriptions or sharing.
 * @returns Service name slug to use as a has key. Returns `undefined` when URL can not be parsed or hostname isn't mapped to a service.
 */
function getServiceFromUrl(url?: string | null) {
  if (!url) return undefined;

  try {
    const { hostname } = new URL(url);
    const service = servicesDomainMap.get(hostname.replace(/^www\./, ''));

    return service;
  } catch (e) {
    return undefined;
  }
}

export default getServiceFromUrl;
