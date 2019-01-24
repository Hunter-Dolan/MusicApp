/**
 * Application Entry Point
 * Note: You probably want to be looking at /src/ not /build/
 */

const { Backend } = require('./build/');

const backend = new Backend()
backend.serve();
