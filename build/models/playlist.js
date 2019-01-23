"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ARTIST = 'artist';
const ALBUM = 'album';
const ALL = 'all';
class Playlist {
    constructor(meta, tracks) {
        this.meta = meta;
        this.meta.slug = this.slug;
        this.tracks = tracks;
        meta.trackCount = tracks.length;
    }
    static buildPlaylistsForTracks(tracks) {
        const playlists = {};
        const artists = {};
        const albums = {};
        const allTracks = [];
        for (const i in tracks) {
            const track = tracks[i];
            const { album: albumMeta, artist: artistMeta } = track.meta;
            if (albumMeta) {
                const albumTitle = albumMeta.title;
                let album = albums[albumTitle];
                if (!album) {
                    album = albums[albumTitle] = [];
                }
                album.push(track);
            }
            if (artistMeta) {
                const artistName = artistMeta.name;
                let artist = artists[artistName];
                if (!artist) {
                    artist = artists[artistName] = [];
                }
                artist.push(track);
            }
            allTracks.push(track);
        }
        for (const artist in artists) {
            const tracks = artists[artist];
            const playlist = new Playlist({ name: artist, type: ARTIST }, tracks);
            playlists[playlist.slug] = playlist;
        }
        for (const album in albums) {
            const tracks = albums[album];
            const playlist = new Playlist({ name: album, type: ALBUM }, tracks);
            playlists[playlist.slug] = playlist;
        }
        const playlist = new Playlist({ name: 'all', type: ALL }, allTracks);
        playlists[playlist.slug] = playlist;
        return playlists;
    }
    static playlistMetaListings(playlists) {
        return Object.keys(playlists).map((key) => {
            const playlist = playlists[key];
            return playlist.meta;
        });
    }
    toJSON() {
        const { meta } = this;
        const tracks = this.tracks.map(track => track.toJSON());
        return Object.assign({ tracks }, meta);
    }
    get slug() {
        return this.meta.name.replace(/[^\x00-\x7F]/g, "").split(' ').join('_').toLowerCase();
    }
}
exports.Playlist = Playlist;
