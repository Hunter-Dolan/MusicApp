"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playlist_1 = require("../models/playlist");
class PlaylistController {
    static index(req, res, store) {
        const playlists = playlist_1.Playlist.playlistMetaListings(store.playlists);
        res.send({ playlists });
    }
    static show(req, res, store) {
        const { slug } = req.params;
        if (!slug) {
            res.send({ error: true });
            return;
        }
        const playlist = store.playlists[slug];
        if (!slug) {
            res.send({ error: true });
            return;
        }
        res.send({ playlist });
    }
}
exports.PlaylistController = PlaylistController;
