"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TrackController {
    static show(req, res, store) {
        const { artist, track: trackKey, screename } = req.params;
        const slug = [artist, trackKey].join('/');
        const track = store.tracks[slug];
        res.send({ track: track.toJSON(true) });
    }
}
exports.TrackController = TrackController;
