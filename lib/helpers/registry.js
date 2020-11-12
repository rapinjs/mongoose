"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistry = exports.initRegistry = void 0;
let localRegistry;
exports.initRegistry = ({ registry }) => {
    localRegistry = registry;
};
exports.getRegistry = () => localRegistry;
//# sourceMappingURL=registry.js.map