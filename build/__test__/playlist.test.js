"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const track_1 = require("../models/track");
const playlist_1 = require("../models/playlist");
describe('Playlists', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
    it('can build playlists', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tracks = yield track_1.Track.loadTracks();
        const playlists = yield playlist_1.Playlist.buildPlaylistsForTracks(tracks);
        expect(Object.keys(playlists).length).toBeGreaterThan(0);
    }));
    it('can associate meta data', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tracks = yield track_1.Track.loadTracks();
        const playlists = yield playlist_1.Playlist.buildPlaylistsForTracks(tracks);
        const playlist = playlists[Object.keys(playlists)[0]];
        expect(playlist.meta.name).toBeTruthy();
        expect(playlist.meta.type).toBeTruthy();
    }));
    it('has all', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tracks = yield track_1.Track.loadTracks();
        const playlists = yield playlist_1.Playlist.buildPlaylistsForTracks(tracks);
        const playlist = playlists.all;
        expect(playlist).toBeTruthy();
        expect(playlist.meta.name).toBe('all');
    }));
}));
