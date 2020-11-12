"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const helpers_1 = require("../helpers");
const lodash_1 = require("lodash");
exports.Auth = (roles = []) => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const registry = helpers_1.getRegistry();
            if (registry) {
                if (registry
                    .get('user')
                    .isLogged()) {
                    if (!lodash_1.isEmpty(roles)) {
                        if (lodash_1.isArray(roles)) {
                            if (lodash_1.includes(roles, registry.get('user').getRole().codename)) {
                                return originalMethod.apply(this, args);
                            }
                            else {
                                registry
                                    .get('error')
                                    .set('unauthorized');
                            }
                        }
                        else {
                            if (roles === registry.get('user').getRole().codename) {
                                return originalMethod.apply(this, args);
                            }
                            else {
                                registry
                                    .get('error')
                                    .set('unauthorized');
                            }
                        }
                    }
                    else {
                        return originalMethod.apply(this, args);
                    }
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