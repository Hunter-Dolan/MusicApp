import { Track } from './models/track';
import { Playlist } from './models/playlist';

export class Store {
  tracks?: {[key: string]: Track};
  playlists?: {[key: string]: Playlist};
}
