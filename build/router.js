"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const track_controller_1 = require("./controllers/track_controller");
const playlist_controller_1 = require("./controllers/playlist_controller");
class Router {
    constructor(server, store) {
        this.server = server;
        this.store = store;
    }
    register() {
        const { server } = this;
        this.get('/tracks/:artist/:track', track_controller_1.TrackController.show);
        this.get('/playlists', playlist_controller_1.PlaylistController.index);
        this.get('/playlists/:slug', playlist_controller_1.PlaylistController.show);
    }
    get(path, handler) {
        this.server.get(path, this.wrapHandler(handler));
    }
    wrapHandler(handler) {
        return (req, res) => {
            handler(req, res, this.store);
        };
    }
}
exports.Router = Router;
