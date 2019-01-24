"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playlist_1 = require("../models/playlist");
class PlaylistController {
    /**
     * Grabs all of the playlists from the store and prints them
     * @param req
     * @param res
     * @param store
     */
    static index(req, res, store) {
        const playlists = playlist_1.Playlist.playlistMetaListings(store.playlists);
        res.send({ playlists });
    }
    /**
     * Shows info on a specific playlist (identified by slug)
     * @param req
     * @param res
     * @param store
     */
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
