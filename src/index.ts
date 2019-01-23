const port = 3001;

import express from 'express';

import HTTP from 'http';
import SocketIO from 'socket.io';

import { Logger } from './utils/logger';

import { Store } from './store';

import { Router } from './router';
import { Track } from './models/track';
import { Playlist } from './models/playlist';
import { SocketController } from './controllers/socket_controller';


export class Backend {
  public app: express.Express;
  public logger: Logger

  public server: HTTP.Server;
  public io: SocketIO.Server;

  public store: Store;

  constructor() {
    this.logger = new Logger();
    this.store = new Store();

    this.app = express()

    this.server = new HTTP.Server(this.app)
    this.io = SocketIO(this.server);

    this.bindSocketIO();

    const router = new Router(this.app, this.store)
    router.register();
  }

  public async serve() {
    this.logger.debug('Loading tracks, this might take a while...');
    const tracks = await Track.loadTracks();
    this.logger.debug('Loaded', Object.keys(tracks).length, 'tracks!')

    this.store.tracks = tracks;

    this.logger.debug('Building playlists');
    const playlists = await Playlist.buildPlaylistsForTracks(tracks);
    this.logger.debug('Built', Object.keys(playlists).length, 'playlists!');

    this.store.playlists = playlists;
    
    this.server.listen(port);
    this.logger.info('Starting server on port', port);
  }

  private bindSocketIO() {
    this.io.on('connection', SocketController.handleConnection);
  }
}