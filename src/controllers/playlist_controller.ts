import { Playlist } from '../models/playlist';

import { Request, Response } from 'express';

import { Store } from '../store';

export class PlaylistController {

  /**
   * Grabs all of the playlists from the store and prints them
   * @param req
   * @param res
   * @param store
   */

  public static index(req: Request, res: Response, store: Store) {
    const playlists = Playlist.playlistMetaListings(store.playlists!);
    res.send({ playlists });
  }

  /**
   * Shows info on a specific playlist (identified by slug)
   * @param req
   * @param res
   * @param store
   */

  public static show(req: Request, res: Response, store: Store) {
    const { slug } = req.params;

    if (!slug) {
      res.send({ error: true });
      return;
    }

    const playlist = store.playlists![slug];

    if (!slug) {
      res.send({ error: true });
      return;
    }

    res.send({ playlist });
  }

}
