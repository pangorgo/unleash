"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
let muteError = false;
function noLoggerProvider() {
    // do something with the name
    return {
        debug: () => { },
        info: () => { },
        warn: () => { },
        error: muteError ? () => { } : console.error,
        fatal: console.error,
    };
}
noLoggerProvider.setMuteError = (mute) => {
    muteError = mute;
};
module.exports = noLoggerProvider;
exports.default = noLoggerProvider;
//# sourceMappingURL=no-logger.js.map