"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const plugin_1 = require("./plugin");
const lodash_1 = require("lodash");
__export(require("./decorators"));
const helpers_1 = require("./helpers");
class MongoosePlugin {
    afterInitRegistry({ config, registry }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mongooseClient = yield mongoose.connect(config.mongoose.uri, {
                    useFindAndModify: false,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    autoReconnect: true
                });
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