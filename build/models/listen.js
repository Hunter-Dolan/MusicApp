"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const events_1 = tslib_1.__importDefault(require("events"));
class Listen {
    constructor(track, screename) {
        this.track = track;
        this.screename = screename;
    }
    /**
     * Sends a listening message to all who are subscribed to events
     */
    broadcast() {
        Listen.events.emit('listen', this);
    }
    /**
     * Converts the object to a json response
     */
    toJSON() {
        const { screename } = this;
        const track = this.track.toJSON();
        return {
            screename,
            track,
        };
    }
}
/**
 * Allows for listening to Listen events
 */
Listen.events = new events_1.default.EventEmitter();
exports.Listen = Listen;
