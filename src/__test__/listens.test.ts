import { Track } from '../models/track';
import { Listen } from '../models/listen';

describe('Listens', async () => {
  it('can broadcast listen', async () => {
    const tracks = await Track.loadTracks();
    const track = tracks[Object.keys(tracks)[0]];

    const listen = new Listen(track, 'name');
    listen.broadcast();
  });

  it('can hear listen', async () => {
    const tracks = await Track.loadTracks();
    const track = tracks[Object.keys(tracks)[0]];

    const listen = new Listen(track, 'name');

    Listen.events.on('listen', (_listen) => {
      expect(_listen).toBe(listen);
    });

    listen.broadcast();

    expect.assertions(1);
  });

});
