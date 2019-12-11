"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const lodash_1 = require("lodash");
//@ts-ignore
const User_1 = __importDefault(require("entities/User"));
//@ts-ignore
const Role_1 = __importDefault(require("entities/Role"));
class User {
    constructor(registry) {
        this.crypto = registry.get('crypto');
        this.token = '';
        this.userId = '';
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.image = '';
        this.roleType = '';
    }
    login(email, password, override = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ email }).exec();
            if (!user) {
                return false;
            }
            let userInfo;
            if (override) {
                userInfo = user;
            }
            else {
                const passwordHash = this.crypto.getHashPassword(password, user.salt);
                userInfo = yield User_1.default.findOne({ email, password: passwordHash.hash, salt: passwordHash.salt }).exec();
            }
            if (!lodash_1.isEmpty(userInfo)) {
                this.token = jwt.sign(lodash_1.toPlainObject(userInfo.toJSON()), process.env.SECRET_KEY, {
                    expiresIn: 21600,
                });
                this.userId = userInfo.id;
                this.firstName = userInfo.firstName;
                this.lastName = userInfo.lastName;
                this.email = userInfo.email;
                this.image = userInfo.image;
                this.roleType = userInfo.roleId;
                this.role = yield Role_1.default.findById(userInfo.roleId).exec();
                return this.token;
            }
            else {
                return false;
            }
        });
    }
    getToken(email, password, expiresIn = 21600) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ email }).exec();
            if (!user) {
                return false;
            }
            const passwordHash = this.crypto.getHashPassword(password, user.salt);
            const userInfo = yield User_1.default.findOne({ email, password: passwordHash.hash, salt: passwordHash.salt }).exec();
            if (!lodash_1.isEmpty(userInfo)) {
                const token = jwt.sign(lodash_1.toPlainObject(userInfo.toJSON()), process.env.SECRET_KEY, {
                    expiresIn,
                });
                return token;
            }
            else {
                return false;
            }
        });
    }
    verify(token, login = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = jwt.verify(token, lodash_1.toString(process.env.SECRET_KEY));
                const userInfo = yield User_1.default.findOne({ email: user.email }).exec();
                if (userInfo) {
                    if (login) {
                        this.token = token;
                        this.userId = userInfo.id;
                        this.firstName = userInfo.firstName;
                        this.lastName = userInfo.lastName;
                        this.email = userInfo.email;
                        this.image = userInfo.image;
                        this.roleType = userInfo.roleId;
                        this.role = yield Role_1.default.findById(userInfo.roleId).exec();
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                return false;
            }
        });
    }
    getId() {
        return this.userId;
    }
    getFirstName() {
        return this.firstName;
    }
    getLastName() {
        return this.lastName;
    }
    getEmail() {
        return this.email;
    }
    getImage() {
        return this.image;
    }
    getRoleType() {
        return this.roleType;
    }
    getRole() {
        return this.role;
    }
    isLogged() {
        return !!this.token;
    }
}
exports.User = User;
//# sourceMappingURL=plugin.js.map