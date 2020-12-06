export default class Logger {
    constructor(namespace) {
        this._namespace = namespace;
    }

    error(...params) {
        console.error(this._namespace, ...params);
    }

    warn(...params) {
        console.warn(this._namespace, ...params);
    }

    info(...params) {
        console.info(this._namespace, ...params);
    }

    debug(...params) {
        console.debug(this._namespace, ...params);
    }

    trace(...params) {
        console.trace(this._namespace, ...params);
    }
}
