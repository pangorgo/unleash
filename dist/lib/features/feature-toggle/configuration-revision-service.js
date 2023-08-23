"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_REVISION = void 0;
const stream_1 = require("stream");
exports.UPDATE_REVISION = 'UPDATE_REVISION';
class ConfigurationRevisionService extends stream_1.EventEmitter {
    constructor({ eventStore }, { getLogger }) {
        super();
        this.logger = getLogger('configuration-revision-service.ts');
        this.eventStore = eventStore;
        this.revisionId = 0;
    }
    async getMaxRevisionId() {
        if (this.revisionId > 0) {
            return this.revisionId;
        }
        else {
            return this.updateMaxRevisionId();
        }
    }
    async updateMaxRevisionId() {
        const revisionId = await this.eventStore.getMaxRevisionId(this.revisionId);
        if (this.revisionId !== revisionId) {
            this.logger.debug('Updating feature configuration with new revision Id', revisionId);
            this.emit(exports.UPDATE_REVISION, revisionId);
            this.revisionId = revisionId;
        }
        return this.revisionId;
    }
}
exports.default = ConfigurationRevisionService;
//# sourceMappingURL=configuration-revision-service.js.map