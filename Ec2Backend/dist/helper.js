"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function normalizePort(val) {
    let port = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port))
        return val;
    else if (port >= 0)
        return port;
    else
        return false;
}
exports.normalizePort = normalizePort;
function processHeader() {
    return function (req, res, next) {
        if (req.headers['x-amz-sns-message-type']) {
            req.headers['content-type'] = 'application/json;charset=UTF-8';
        }
        next();
    };
}
exports.processHeader = processHeader;
//# sourceMappingURL=helper.js.map