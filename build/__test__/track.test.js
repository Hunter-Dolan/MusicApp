"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const track_1 = require("../models/track");
describe('Tracks', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
    it('can build tracks', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tracks = yield track_1.Track.loadTracks();
        expect(Object.keys(tracks).length).toBeGreaterThan(0);
    }));
    it('can associate meta data', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tracks = yield track_1.Track.loadTracks();
        const track = tracks[Object.keys(tracks)[0]];
        expect(track.meta.name).toBeTruthy();
        expect(track.meta.artist).toBeTruthy();
    }));
    it('can return url', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tracks = yield track_1.Track.loadTracks();
        const track = tracks[Object.keys(tracks)[2]];
        expect(track.url).toBeTruthy();
    }));
}));
