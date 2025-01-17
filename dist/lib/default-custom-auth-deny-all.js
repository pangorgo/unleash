"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCustomAuthDenyAll = void 0;
const customAuthWarning = 'You have to configure a custom authentication middleware. Read https://docs.getunleash.io/docs/reference/deploy/configuring-unleash for more details';
function defaultCustomAuthDenyAll(
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
app, config) {
    const logger = config.getLogger('src/lib/app/customAuthHandler');
    app.use(`${config.server.baseUriPath}/api`, async (req, res) => {
        logger.error(customAuthWarning);
        res.status(401).send({
            error: customAuthWarning,
        });
    });
}
exports.defaultCustomAuthDenyAll = defaultCustomAuthDenyAll;
//# sourceMappingURL=default-custom-auth-deny-all.js.map