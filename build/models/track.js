"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const lastfm_1 = require("../utils/lastfm");
const dataloader_1 = require("../utils/dataloader");
class Track {
    constructor(id, url) {
        this.url = url;
        this.id = id;
    }
    /*
     * Initial Discovery
     */
    static loadTracks() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const trackEntries = yield dataloader_1.DataLoader.listTracks();
            const allTracks = {};
            for (const i in trackEntries) {
                const { id, url } = trackEntries[i];
                const track = new Track(id, url);
                yield track.loadMeta();
                allTracks[track.slug] = track;
            }
            return allTracks;
        });
    }
    toJSON(includeURL = false) {
        const { meta } = this;
        if (includeURL) {
            const { url } = this;
            return Object.assign({ url }, meta);
        }
        return meta;
    }
    /*
     * Initial Meta Loading
     */
    get idComponents() {
        const [artist, track] = this.id.split('/').map((component) => {
            return component.split('_').join(' ');
        });
        return { artist, track };
    }
    loadMeta() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.meta) {
                return;
            }
            const { artist: artistKey, track: trackKey } = this.idComponents;
            const { track } = yield lastfm_1.LastFM.loadDataForArtistAndTrack(artistKey, trackKey);
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
        });
    }
    albumMetaFromLastFMData(albumData) {
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
    artistMetaFromLastFMData(artistData) {
        if (!artistData) {
            return;
        }
        const { name } = artistData;
        return {
            name,
        };
    }
    get slug() {
        return this.id.replace(/[^\x00-\x7F]/g, "").split(' ').join('_').toLowerCase();
    }
}
exports.Track = Track;
