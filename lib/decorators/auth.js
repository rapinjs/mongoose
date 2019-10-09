"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
exports.Auth = () => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const registry = helpers_1.getRegistry();
            if (registry) {
                if (registry
                    .get('user')
                    .isLogged()) {
                    return originalMethod.apply(this, args);
                }
                else {
                    registry
                        .get('error')
                        .set('unauthorized');
                }
            }
        };
    };
};
//# sourceMappingURL=auth.js.map