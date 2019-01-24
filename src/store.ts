import { Track } from './models/track';
import { Playlist } from './models/playlist';

/**
 * A dumb and simple application store that collects any
 * shared data that is used across the server process
 */
export class Store {
  tracks?: {[key: string]: Track};
  playlists?: {[key: string]: Playlist};
}
