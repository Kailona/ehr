export default class UnauthorizedException extends Error {
    constructor(message = '') {
        super();

        this.message = `UnauthorizedException: ${message}`;
    }
}
