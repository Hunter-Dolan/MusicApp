import { Track } from './track';
import Events from 'events';

export class Listen {
  /**
   * Allows for listening to Listen events
   */
  public static events = new Events.EventEmitter();

  private track: Track;
  private screename?: string;

  constructor(track: Track, screename?: string) {
    this.track = track;
    this.screename = screename;
  }

  /**
   * Sends a listening message to all who are subscribed to events
   */
  public broadcast() {
    Listen.events.emit('listen', this);
  }

  /**
   * Converts the object to a json response
   */
  public toJSON() {
    const { screename } = this;
    const track = this.track.toJSON();

    return {
      screename,
      track,
    };
  }
}
