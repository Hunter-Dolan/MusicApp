"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
class Config {
}
Config.S3_BUCKET = process.env.S3_BUCKET;
Config.S3_PREFIX = 'tracks/';
Config.S3_URL_PREFIX = `https://s3.amazonaws.com/${Config.S3_BUCKET}/`;
Config.LASTFM_API_KEY = process.env.LASTFM_API_KEY;
Config.LASTFM_API_HOST = 'https://ws.audioscrobbler.com/2.0/';
Config.LASTFM_BASE_PARAMS = {
    api_key: Config.LASTFM_API_KEY,
    format: 'json',
};
Config.CACHE_PATH = path_1.default.resolve('./cache/');
exports.default = Config;
