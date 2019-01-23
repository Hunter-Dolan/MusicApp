import { Track } from './track';
import Events from 'events';

export class Listen {
  public static events = new Events.EventEmitter();
  private track: Track;
  private screename?: string;

  constructor(track: Track, screename?: string) {
    this.track = track;
    this.screename = screename;
  }

  public broadcast() {
    Listen.events.emit('listen', this);
  }

  public toJSON() {
    const { screename } = this;
    const track = this.track.toJSON();

    return {
      screename,
      track,
    };
  }
}
