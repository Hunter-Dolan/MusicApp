"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listen_1 = require("../models/listen");
class SocketController {
    /**
     * Will handle a socket io connection and subscribe them to listens
     * @param socket - The socket io socket that just connected
     */
    static handleConnection(socket) {
        const listenerCallback = (listen) => {
            socket.emit('listen', listen.toJSON());
        };
        listen_1.Listen.events.on('listen', listenerCallback);
        socket.on('disconnect', () => {
            listen_1.Listen.events.removeListener('listen', listenerCallback);
        });
    }
}
exports.SocketController = SocketController;
