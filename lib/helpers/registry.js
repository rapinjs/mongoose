"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let localRegistry;
exports.initRegistry = ({ registry }) => {
    localRegistry = registry;
};
exports.getRegistry = () => localRegistry;
//# sourceMappingURL=registry.js.map