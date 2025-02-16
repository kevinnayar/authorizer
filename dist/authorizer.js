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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthorizer = createAuthorizer;
function createCacheKey(parent, child) {
    return "AuthorizerParent:<".concat(parent, ">_AuthorizerChild:<").concat(child, ">");
}
function getLogger(verbose) {
    var handleLog = function (fn) {
        var messages = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            messages[_i - 1] = arguments[_i];
        }
        if (verbose) {
            console[fn].apply(console, __spreadArray(['[Authorizer]'], messages, false));
        }
    };
    return {
        log: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return handleLog.apply(void 0, __spreadArray(['log'], args, false));
        },
        error: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return handleLog.apply(void 0, __spreadArray(['error'], args, false));
        },
        warn: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return handleLog.apply(void 0, __spreadArray(['warn'], args, false));
        },
        debug: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return handleLog.apply(void 0, __spreadArray(['debug'], args, false));
        },
        info: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return handleLog.apply(void 0, __spreadArray(['info'], args, false));
        },
        trace: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return handleLog.apply(void 0, __spreadArray(['trace'], args, false));
        },
    };
}
function createAuthorizer(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, cache, CACHED_TOKEN, validatorMap, _i, _a, _b, parent_1, child, validator, key, validate, validateMany;
        var _this = this;
        return __generator(this, function (_c) {
            logger = getLogger(opts.verbose);
            cache = opts.cache || null;
            CACHED_TOKEN = '__CACHED_TOKEN__';
            validatorMap = new Map();
            for (_i = 0, _a = opts.validators; _i < _a.length; _i++) {
                _b = _a[_i], parent_1 = _b.parent, child = _b.child, validator = _b.validator;
                key = createCacheKey(parent_1, child);
                logger.log("Saving validator method for ".concat(key));
                validatorMap.set(key, validator);
            }
            validate = function (parent, child) { return __awaiter(_this, void 0, void 0, function () {
                var cacheKey, _a, key, validator, error, value, error;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            cacheKey = createCacheKey("".concat(parent.key, "_").concat(parent.id), "".concat(child.key, "_").concat(child.id));
                            _a = cache;
                            if (!_a) return [3 /*break*/, 2];
                            return [4 /*yield*/, cache.get(cacheKey)];
                        case 1:
                            _a = (_b.sent()) === CACHED_TOKEN;
                            _b.label = 2;
                        case 2:
                            if (_a) {
                                logger.log("Cache hit for ".concat(cacheKey));
                                return [2 /*return*/, true];
                            }
                            key = createCacheKey(parent.key, child.key);
                            validator = validatorMap.get(key);
                            if (typeof validator !== 'function') {
                                error = [
                                    "No authorizer validation function exists for this parent",
                                    "\"".concat(parent.key, "\" and child \"").concat(child.key, "\" relationship."),
                                ].join(' ');
                                logger.error(error);
                                throw new Error(error);
                            }
                            return [4 /*yield*/, validator(parent, child)];
                        case 3:
                            value = _b.sent();
                            if (!value) {
                                error = [
                                    "Parent entity \"".concat(parent.key, "\": ").concat(parent.id, " does not"),
                                    "have access to child entity \"".concat(child.key, "\": ").concat(child.id, "."),
                                ].join(' ');
                                logger.error(error);
                                throw new Error(error);
                            }
                            if (!cache) return [3 /*break*/, 5];
                            return [4 /*yield*/, cache.set(cacheKey, CACHED_TOKEN)];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [2 /*return*/, value];
                    }
                });
            }); };
            validateMany = function (entities) { return __awaiter(_this, void 0, void 0, function () {
                var results, i, _a, parent_2, child, result;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            results = [];
                            i = 0;
                            _b.label = 1;
                        case 1:
                            if (!(i < entities.length)) return [3 /*break*/, 4];
                            _a = entities[i], parent_2 = _a[0], child = _a[1];
                            return [4 /*yield*/, validate(parent_2, child)];
                        case 2:
                            result = _b.sent();
                            results.push(result);
                            _b.label = 3;
                        case 3:
                            i += 1;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, results];
                    }
                });
            }); };
            return [2 /*return*/, {
                    validate: validate,
                    validateMany: validateMany,
                }];
        });
    });
}
