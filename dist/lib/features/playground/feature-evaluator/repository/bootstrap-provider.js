"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBootstrapProvider = exports.DefaultBootstrapProvider = void 0;
class DefaultBootstrapProvider {
    constructor(options) {
        this.data = options.data;
        this.segments = options.segments;
    }
    async readBootstrap() {
        if (this.data) {
            return {
                version: 2,
                segments: this.segments,
                features: [...this.data],
            };
        }
        return undefined;
    }
}
exports.DefaultBootstrapProvider = DefaultBootstrapProvider;
function resolveBootstrapProvider(options) {
    return new DefaultBootstrapProvider(options);
}
exports.resolveBootstrapProvider = resolveBootstrapProvider;
//# sourceMappingURL=bootstrap-provider.js.map