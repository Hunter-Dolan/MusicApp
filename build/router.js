"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const track_controller_1 = require("./controllers/track_controller");
const playlist_controller_1 = require("./controllers/playlist_controller");
class Router {
    constructor(server, store) {
        this.server = server;
        this.store = store;
    }
    /**
     * Registers various api paths
     */
    register() {
        const { server } = this;
        this.get('/tracks/:artist/:track', track_controller_1.TrackController.show);
        this.get('/playlists', playlist_controller_1.PlaylistController.index);
        this.get('/playlists/:slug', playlist_controller_1.PlaylistController.show);
    }
    /**
     * A convenience method that will wrap the handlers in the wrapHandler method
     * @param path The path of the route you are registering
     * @param handler The handler that you're registering
     */
    get(path, handler) {
        this.server.get(path, this.wrapHandler(handler));
    }
    /**
     * A method that adds the store as a parameter to each request
     * @param handler The handler that you're registering
     */
    wrapHandler(handler) {
        return (req, res) => {
            handler(req, res, this.store);
        };
    }
}
exports.Router = Router;
