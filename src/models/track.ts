import { LastFM } from '../utils/lastfm';
import { DataLoader } from '../utils/dataloader';

export type Meta = {
  slug: string,

  name: string,
  duration: number,

  artist?: Artist,
  album?: Album
};

export type Album = {
  title: string,
  image: string,
};

export type Artist = {
  name: string,
};

export class Track {
  id: string;
  url: string;

  meta?: Meta;

  constructor(id:string, url: string) {
    this.url = url;
    this.id = id;
  }

  /**
   * Loads the tracks from the data loader (currently S3) then loads
   * the meta information for each track from LastFM (or cache)
   */
  public static async loadTracks() {
    const trackEntries = await DataLoader.listTracks();
    const allTracks:{[key: string]: Track} = {};

    for (const i in trackEntries) {
      const { id, url } = trackEntries[i];

      const track = new Track(id, url);
      await track.loadMeta();

      allTracks[track.slug] = track;
    }

    return allTracks;
  }

  /**
   * Converts the object to JSON
   * @param includeURL Defines if the URL should be included in the response
   */
  public toJSON(includeURL: boolean = false) {
    const { meta } = this;

    if (includeURL) {
      const { url } = this;
      return { url, ...meta };
    }

    return meta;
  }

  /**
   * Breaks the id (which is the key of the file off of S3) into artist and track
   * because the directory structure is /tracks/[artist]/[track]
   */

  private get idComponents() {
    const [artist, track] = this.id.split('/').map((component: string) => {
      return component.split('_').join(' ');
    });

    return { artist, track };
  }

  /**
   * Retrieves the meta info from Last.fm (or the cache)
   */
  private async loadMeta() {
    if (this.meta) {
      return;
    }

    const { artist: artistKey, track: trackKey } = this.idComponents;

    const { track } = await LastFM.loadDataForArtistAndTrack(artistKey, trackKey);
    const { name, duration, artist: artistData, album: albumData } = track;

    const album = this.albumMetaFromLastFMData(albumData);
    const artist = this.artistMetaFromLastFMData(artistData);

    const slug = this.slug;

    this.meta = {
      name,
      duration,
      album,
      artist,
      slug,
    };
  }

  /**
   * Takes and parses album data from LastFM
   * @param albumData - Album data from LastFM
   */
  private albumMetaFromLastFMData(albumData: {[key: string]: any}) {
    if (!albumData) {
      return;
    }

    const { title, image: imageData } = albumData;
    const image = imageData[imageData.length - 1]['#text'];

    return {
      title,
      image,
    };
  }

  /**
   * Takes and parses artist data from LastFM
   * @param artistData - Artist data from LastFM
   */
  private artistMetaFromLastFMData(artistData: {[key: string]: any}) {
    if (!artistData) {
      return;
    }

    const { name } = artistData;

    return {
      name,
    };
  }

  /**
   * The universal identifier for this track
   */
  get slug() {
    return this.id.replace(/[^\x00-\x7F]/g, "").split(' ').join('_').toLowerCase();
  }
}
