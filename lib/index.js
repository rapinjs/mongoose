"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const plugin_1 = require("./plugin");
const lodash_1 = require("lodash");
__exportStar(require("./decorators"), exports);
const helpers_1 = require("./helpers");
class MongoosePlugin {
    afterInitRegistry({ config, registry }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let options = {};
                if (config.mongoose.options) {
                    options = Object.assign(Object.assign({}, options), config.mongoose.options);
                }
                const mongooseClient = yield mongoose_1.default.connect(config.mongoose.uri, Object.assign({ useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }, options));
                registry.set('mongoose', mongooseClient);
            }
            catch (e) {
                console.log('error');
                console.log(e);
            }
        });
    }
    onBeforeRequest({ registry, ctx }) {
        return __awaiter(this, void 0, void 0, function* () {
            helpers_1.initRegistry({ registry });
            registry.set('user', new plugin_1.User(registry));
            const token = !lodash_1.isUndefined(ctx.request.headers.token)
                ? ctx.request.headers.token
                : false;
            if (token) {
                yield registry.get('user').verify(token);
            }
            else {
                const authToken = !lodash_1.isUndefined(ctx.request.headers.authorization)
                    ? ctx.request.headers.authorization
                    : false;
                if (authToken) {
                    yield registry.get('user').verify(authToken);
                }
            }
        });
    }
}
exports.default = MongoosePlugin;
//# sourceMappingURL=index.js.map