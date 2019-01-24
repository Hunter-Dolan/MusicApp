"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const https_1 = tslib_1.__importDefault(require("https"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const config_1 = tslib_1.__importDefault(require("../config"));
const urijs_1 = tslib_1.__importDefault(require("urijs"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const CACHE_FILE_PATH = path_1.default.join(config_1.default.CACHE_PATH, 'lastfm_cache.json');
class LastFM {
    /**
     * Gets track info off of last.fm
     * @param artist The artist you are searching for
     * @param track The track name
     */
    static loadDataForArtistAndTrack(artist, track) {
        return LastFM.executeAPICall('track.getInfo', { artist, track, autocorrect: 1 });
    }
    /**
     * Convenience method to make API requests to last.fm
     * @param method The LastFM API method you're calling
     * @param params The params for that method
     */
    static executeAPICall(method, params) {
        const url = new urijs_1.default(config_1.default.LASTFM_API_HOST).addSearch(config_1.default.LASTFM_BASE_PARAMS)
            .addSearch({ method })
            .addSearch(params)
            .toString();
        return new Promise((resolve, reject) => {
            const cacheResponse = this.getCachedResponse(method, params);
            if (cacheResponse) {
                resolve(cacheResponse);
                return;
            }
            https_1.default.get(url, (res) => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        const response = JSON.parse(rawData.toString());
                        this.setCachedResponse(method, params, response);
                        resolve(response);
                    }
                    catch (e) {
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
    static loadCache() {
        try {
            if (this.cache) {
                return;
            }
            if (!fs_1.default.existsSync(config_1.default.CACHE_PATH)) {
                fs_1.default.mkdirSync(config_1.default.CACHE_PATH);
            }
            if (!fs_1.default.existsSync(CACHE_FILE_PATH)) {
                this.cache = {};
                return;
            }
            this.cache = JSON.parse(fs_1.default.readFileSync(CACHE_FILE_PATH).toString());
        }
        catch (_) {
            this.cache = {};
        }
    }
    /**
     * Determines the cache key for a specific query. Useful when getting items
     * from the cache
     * @param method The lastFM api method
     * @param params The params for that method
     */
    static cacheKey(method, params) {
        const key = JSON.stringify({ method, params });
        const sha1 = crypto_1.default.createHash('sha1');
        sha1.update(key);
        return sha1.digest('hex');
    }
    /**
     * Gets a API response from the cache
     * @param method The lastFM api method
     * @param params The params for that method
     */
    static getCachedResponse(method, params) {
        this.loadCache();
        return this.cache[this.cacheKey(method, params)];
    }
    /**
     * Caches the API response for future use
     * @param method The lastFM api method
     * @param params The params for that method
     * @param value The response of that call
     */
    static setCachedResponse(method, params, value) {
        this.loadCache();
        this.cache[this.cacheKey(method, params)] = value;
        clearTimeout(this.cacheSaveTimeout);
        this.cacheSaveTimeout = setTimeout(() => {
            fs_1.default.writeFileSync(CACHE_FILE_PATH, JSON.stringify(this.cache));
        }, 2500);
    }
}
exports.LastFM = LastFM;
