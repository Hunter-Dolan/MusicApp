"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const events_1 = tslib_1.__importDefault(require("events"));
class Listen {
    constructor(track, screename) {
        this.track = track;
        this.screename = screename;
    }
    broadcast() {
        Listen.events.emit('listen', this);
    }
    toJSON() {
        const { screename } = this;
        const track = this.track.toJSON();
        return {
            screename,
            track,
        };
    }
}
Listen.events = new events_1.default.EventEmitter();
exports.Listen = Listen;
