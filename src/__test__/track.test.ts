import { Track } from '../models/track';

describe('Tracks', async () => {
  it('can build tracks', async () => {
    const tracks = await Track.loadTracks();
    expect(Object.keys(tracks).length).toBeGreaterThan(0);
  });

  it('can associate meta data', async () => {
    const tracks = await Track.loadTracks();
    const track = tracks[Object.keys(tracks)[0]];

    expect(track.meta!.name).toBeTruthy();
    expect(track.meta!.artist).toBeTruthy();
  });

  it('can return url', async () => {
    const tracks = await Track.loadTracks();
    const track = tracks[Object.keys(tracks)[2]];

    expect(track.url).toBeTruthy();
  });
});
