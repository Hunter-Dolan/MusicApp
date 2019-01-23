"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const track_1 = require("../models/track");
const listen_1 = require("../models/listen");
describe('Listens', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
    it('can broadcast listen', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tracks = yield track_1.Track.loadTracks();
        const track = tracks[Object.keys(tracks)[0]];
        const listen = new listen_1.Listen(track, 'name');
        listen.broadcast();
    }));
    it('can hear listen', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tracks = yield track_1.Track.loadTracks();
        const track = tracks[Object.keys(tracks)[0]];
        const listen = new listen_1.Listen(track, 'name');
        listen_1.Listen.events.on('listen', (_listen) => {
            expect(_listen).toBe(listen);
        });
        listen.broadcast();
        expect.assertions(1);
    }));
}));
