import Path from 'path';

/**
 * A semi centralized config file that is trying to avoid having
 * config vars thrown across the app
 */
export default class Config {
  static S3_BUCKET = process.env.S3_BUCKET;
  static S3_PREFIX = 'tracks/';
  static S3_URL_PREFIX = `https://s3.amazonaws.com/${Config.S3_BUCKET}/`;

  static LASTFM_API_KEY  = process.env.LASTFM_API_KEY;
  static LASTFM_API_HOST = 'https://ws.audioscrobbler.com/2.0/';
  static LASTFM_BASE_PARAMS = {
    api_key: Config.LASTFM_API_KEY,
    format: 'json',
  };

  static CACHE_PATH = Path.resolve('./cache/');
}
