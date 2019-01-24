import Path from 'path';
import HTTPS from 'https';
import FS from 'fs';
import Config from '../config';

import URI from 'urijs';

import Crypto from 'crypto';

const CACHE_FILE_PATH = Path.join(Config.CACHE_PATH, 'lastfm_cache.json');

export class LastFM {
  private static cache?: {[key: string]: any};
  private static cacheSaveTimeout?: any;

  /**
   * Gets track info off of last.fm
   * @param artist The artist you are searching for
   * @param track The track name
   */
  public static loadDataForArtistAndTrack(artist: string, track: string):Promise<{[key: string]: any}> {
    return LastFM.executeAPICall('track.getInfo', { artist, track, autocorrect: 1 });
  }

  /**
   * Convenience method to make API requests to last.fm
   * @param method The LastFM API method you're calling
   * @param params The params for that method
   */

  public static executeAPICall(method: string, params: {[key: string]: any}) {
    const url = new URI(Config.LASTFM_API_HOST).addSearch(Config.LASTFM_BASE_PARAMS)
                                        .addSearch({ method })
                                        .addSearch(params)
                                        .toString();

    return new Promise((resolve, reject) => {
      const cacheResponse = this.getCachedResponse(method, params);

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
            this.setCachedResponse(method, params, response);
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

  /**
   * Checks if there is a cache file, if so, it loads it
   */
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

  /**
   * Determines the cache key for a specific query. Useful when getting items 
   * from the cache
   * @param method The lastFM api method
   * @param params The params for that method
   */
  private static cacheKey(method:string, params:{[key: string]: any}) {
    const key = JSON.stringify({ method, params });
    const sha1 = Crypto.createHash('sha1');
    sha1.update(key);

    return sha1.digest('hex');
  }

  /**
   * Gets a API response from the cache
   * @param method The lastFM api method
   * @param params The params for that method
   */
  private static getCachedResponse(method:string, params:{[key: string]: any}) {
    this.loadCache();
    return this.cache![this.cacheKey(method, params)];
  }

  /**
   * Caches the API response for future use
   * @param method The lastFM api method
   * @param params The params for that method
   * @param value The response of that call
   */
  private static setCachedResponse(method:string, params:{[key: string]: any}, value: {[key: string]: any}) {
    this.loadCache();
    this.cache![this.cacheKey(method, params)] = value;

    clearTimeout(this.cacheSaveTimeout);

    this.cacheSaveTimeout = setTimeout(
      () => {
        FS.writeFileSync(CACHE_FILE_PATH, JSON.stringify(this.cache));
      },
      2500
    );
  }
}
