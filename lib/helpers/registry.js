"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistry = exports.initRegistry = void 0;
let localRegistry;
const initRegistry = ({ registry }) => {
    localRegistry = registry;
};
exports.initRegistry = initRegistry;
const getRegistry = () => localRegistry;
exports.getRegistry = getRegistry;
//# sourceMappingURL=registry.js.map