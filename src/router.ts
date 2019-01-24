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

  /**
   * Registers various api paths
   */
  public register() {
    const { server } = this;

    this.get('/tracks/:artist/:track', TrackController.show);

    this.get('/playlists', PlaylistController.index);
    this.get('/playlists/:slug', PlaylistController.show);
  }

  /**
   * A convenience method that will wrap the handlers in the wrapHandler method
   * @param path The path of the route you are registering
   * @param handler The handler that you're registering
   */
  private get(path: string, handler: Function) {
    this.server.get(path, this.wrapHandler(handler));
  }

  /**
   * A method that adds the store as a parameter to each request
   * @param handler The handler that you're registering
   */
  private wrapHandler(handler: Function) {
    return (req: Express.Request, res: Express.Response) => {
      handler(req, res, this.store);
    };
  }
}
