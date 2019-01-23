"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const https_1 = tslib_1.__importDefault(require("https"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const config_1 = tslib_1.__importDefault(require("../config"));
const urijs_1 = tslib_1.__importDefault(require("urijs"));
const CACHE_FILE_PATH = path_1.default.join(config_1.default.CACHE_PATH, 'lastfm_cache.json');
class LastFM {
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
    static getCachedResponse(url) {
        this.loadCache();
        return this.cache[url];
    }
    static setCachedResponse(url, value) {
        this.loadCache();
        this.cache[url] = value;
        clearTimeout(this.cacheSaveTimeout);
        this.cacheSaveTimeout = setTimeout(() => {
            fs_1.default.writeFileSync(CACHE_FILE_PATH, JSON.stringify(this.cache));
        }, 2500);
    }
    static loadDataForArtistAndTrack(artist, track) {
        return LastFM.executeAPICall('track.getInfo', { artist, track, autocorrect: 1 });
    }
    static executeAPICall(method, params) {
        const url = new urijs_1.default(config_1.default.LASTFM_API_HOST).addSearch(config_1.default.LASTFM_BASE_PARAMS)
            .addSearch({ method })
            .addSearch(params)
            .toString();
        return new Promise((resolve, reject) => {
            const cacheResponse = this.getCachedResponse(url);
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
                        this.setCachedResponse(url, response);
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
}
exports.LastFM = LastFM;
