import { Express } from 'express';

import { TrackController } from './controllers/track_controller';
import { PlaylistController } from './controllers/playlist_controller';

import { Store } from './store';

export class Router {
  private server: Express;
  private store: Store;

  constructor(server: Express, store: Store) {
    this.server = server;
    this.store = store;
  }

  public register() {
    const { server } = this;

    this.get('/tracks/:artist/:track', TrackController.show);

    this.get('/playlists', PlaylistController.index);
    this.get('/playlists/:slug', PlaylistController.show);
  }

  private get(path: string, handler: Function) {
    this.server.get(path, this.wrapHandler(handler));
  }

  private wrapHandler(handler: Function) {
    return (req: Express.Request, res: Express.Response) => {
      handler(req, res, this.store);
    };
  }
}
