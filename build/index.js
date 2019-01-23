"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const port = 3001;
const express_1 = tslib_1.__importDefault(require("express"));
const http_1 = tslib_1.__importDefault(require("http"));
const socket_io_1 = tslib_1.__importDefault(require("socket.io"));
const logger_1 = require("./utils/logger");
const store_1 = require("./store");
const router_1 = require("./router");
const track_1 = require("./models/track");
const playlist_1 = require("./models/playlist");
const socket_controller_1 = require("./controllers/socket_controller");
class Backend {
    constructor() {
        this.logger = new logger_1.Logger();
        this.store = new store_1.Store();
        this.app = express_1.default();
        this.server = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.server);
        this.bindSocketIO();
        const router = new router_1.Router(this.app, this.store);
        router.register();
    }
    serve() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.debug('Loading tracks');
            const tracks = yield track_1.Track.loadTracks();
            this.logger.debug('Loaded', Object.keys(tracks).length, 'tracks!');
            this.store.tracks = tracks;
            this.logger.debug('Building playlists');
            const playlists = yield playlist_1.Playlist.buildPlaylistsForTracks(tracks);
            this.logger.debug('Built', Object.keys(playlists).length, 'playlists!');
            this.store.playlists = playlists;
            this.server.listen(port);
            this.logger.info('Starting server on port', port);
        });
    }
    bindSocketIO() {
        this.io.on('connection', socket_controller_1.SocketController.handleConnection);
    }
}
exports.Backend = Backend;
