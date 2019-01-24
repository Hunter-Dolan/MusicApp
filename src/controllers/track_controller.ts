import { Response, Request } from 'express';
import { Track } from '../models/track';

import { Store } from '../store';

export class TrackController {
  /**
   * Gets a specific track from the store.
   * @param req
   * @param res
   * @param store
   */
  public static show(req: Request, res: Response, store: Store) {
    const { artist, track: trackKey, screename } = req.params;
    const slug = [artist, trackKey].join('/');

    const track = store.tracks![slug];
    res.send({ track: track.toJSON(true) });
  }

}
