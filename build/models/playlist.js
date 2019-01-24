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
    /**
     * Takes a object full of tracks and creates playlists out of them
     * Based on Artist and Album
     * @param tracks The tracks you want to create playlists for
     */
    static buildPlaylistsForTracks(tracks) {
        const playlists = {};
        const artists = {};
        const albums = {};
        const allTracks = [];
        // Loop through each track and organize by the different criteria
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
        // Create for artist
        for (const artist in artists) {
            const tracks = artists[artist];
            const playlist = new Playlist({ name: artist, type: ARTIST }, tracks);
            playlists[playlist.slug] = playlist;
        }
        // Create for album
        for (const album in albums) {
            const tracks = albums[album];
            const playlist = new Playlist({ name: album, type: ALBUM }, tracks);
            playlists[playlist.slug] = playlist;
        }
        // Create the 'all' playlist
        const playlist = new Playlist({ name: 'all', type: ALL }, allTracks);
        playlists[playlist.slug] = playlist;
        return playlists;
    }
    /**
     * Returns an array of meta listings for a specific set of playlists
     * Useful when returning info on groups of playlists
     * @param playlists The playlists you want the meta listing for
     */
    static playlistMetaListings(playlists) {
        return Object.keys(playlists).map((key) => {
            const playlist = playlists[key];
            return playlist.meta;
        });
    }
    /**
     * Converts the object to json
     */
    toJSON() {
        const { meta } = this;
        const tracks = this.tracks.map(track => track.toJSON());
        return Object.assign({ tracks }, meta);
    }
    /**
     * The universal identifier for the playlist
     */
    get slug() {
        const slug = this.meta.name.replace(/[^\x00-\x7F]/g, "").split(' ').join('_').toLowerCase();
        if (this.meta.type === ALL) {
            return slug;
        }
        return `${this.meta.type}_${slug}`;
    }
}
exports.Playlist = Playlist;
