"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constantTimeCompare_1 = require("../util/constantTimeCompare");
class EdgeService {
    constructor({ apiTokenStore }, { getLogger }) {
        this.logger = getLogger('lib/services/edge-service.ts');
        this.apiTokenStore = apiTokenStore;
    }
    async getValidTokens(tokens) {
        const activeTokens = await this.apiTokenStore.getAllActive();
        const edgeTokens = tokens.reduce((result, token) => {
            const dbToken = activeTokens.find((activeToken) => (0, constantTimeCompare_1.constantTimeCompare)(activeToken.secret, token));
            if (dbToken) {
                result.push({
                    token: token,
                    type: dbToken.type,
                    projects: dbToken.projects,
                });
            }
            return result;
        }, []);
        return { tokens: edgeTokens };
    }
}
exports.default = EdgeService;
module.exports = EdgeService;
//# sourceMappingURL=edge-service.js.map