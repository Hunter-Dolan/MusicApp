import Path from 'path';
import HTTPS from 'https';
import FS from 'fs';
import Config from '../config';

import URI from 'urijs';

const CACHE_FILE_PATH = Path.join(Config.CACHE_PATH, 'lastfm_cache.json');

export class LastFM {
  private static cache?: {[key: string]: any};
  private static cacheSaveTimeout?: any;

  private static loadCache() {
    try {
      if (this.cache) {
        return;
      }

      if (!FS.existsSync(Config.CACHE_PATH)) {
        FS.mkdirSync(Config.CACHE_PATH);
      }

      if (!FS.existsSync(CACHE_FILE_PATH)) {
        this.cache = {};
        return;
      }

      this.cache = JSON.parse(FS.readFileSync(CACHE_FILE_PATH).toString());
    } catch (_) {
      this.cache = {};
    }
  }

  private static getCachedResponse(url:string) {
    this.loadCache();
    return this.cache![url];
  }

  private static setCachedResponse(url:string, value:{[key: string]: any}) {
    this.loadCache();
    this.cache![url] = value;

    clearTimeout(this.cacheSaveTimeout);

    this.cacheSaveTimeout = setTimeout(
      () => {
        FS.writeFileSync(CACHE_FILE_PATH, JSON.stringify(this.cache));
      },
      2500
    );
  }

  public static loadDataForArtistAndTrack(artist: string, track: string):Promise<{[key: string]: any}> {
    return LastFM.executeAPICall('track.getInfo', { artist, track, autocorrect: 1 });
  }

  public static executeAPICall(method: string, params: {[key: string]: any}) {
    const url = new URI(Config.LASTFM_API_HOST).addSearch(Config.LASTFM_BASE_PARAMS)
                                        .addSearch({ method })
                                        .addSearch(params)
                                        .toString();

    return new Promise((resolve, reject) => {
      const cacheResponse = this.getCachedResponse(url);

      if (cacheResponse) {
        resolve(cacheResponse);
        return;
      }

      HTTPS.get(url, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const response = JSON.parse(rawData.toString());
            this.setCachedResponse(url, response);
            resolve(response);
          } catch (e) {
            reject(e);
          }
        });

        res.on('error', (err) => {
          reject(err);
        });
      });
    });
  }
}
