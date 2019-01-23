"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const INFO = 'INFO';
const DEBUG = 'DEBUG';
const ERROR = 'ERROR';
const LOGGING_LEVELS = {
    ERROR: 0,
    INFO: 1,
    DEBUG: 2,
};
class Logger {
    constructor() {
        this.logLevel = 2;
    }
    info(...messages) {
        this.log(INFO, messages);
    }
    debug(...messages) {
        this.log(DEBUG, messages);
    }
    error(...messages) {
        this.log(ERROR, messages);
    }
    log(type, messages) {
        const level = LOGGING_LEVELS[type];
        if (level > this.logLevel) {
            return;
        }
        console.log(`[${type}] ${messages.join(' ')}`);
    }
}
exports.Logger = Logger;
