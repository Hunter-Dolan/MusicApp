import { Track } from '../models/track';
import { Playlist } from '../models/playlist';

describe('Playlists', async () => {
  it('can build playlists', async () => {
    const tracks = await Track.loadTracks();
    const playlists = await Playlist.buildPlaylistsForTracks(tracks);
    expect(Object.keys(playlists).length).toBeGreaterThan(0);
  });

  it('can associate meta data', async () => {
    const tracks = await Track.loadTracks();
    const playlists = await Playlist.buildPlaylistsForTracks(tracks);

    const playlist = playlists[Object.keys(playlists)[0]];

    expect(playlist.meta!.name).toBeTruthy();
    expect(playlist.meta!.type).toBeTruthy();
  });

  it('has all', async () => {
    const tracks = await Track.loadTracks();
    const playlists = await Playlist.buildPlaylistsForTracks(tracks);

    const playlist = playlists.all;

    expect(playlist).toBeTruthy();
    expect(playlist.meta.name).toBe('all');
  });
});
