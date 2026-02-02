"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_DEFINITIONS = exports.ErrorCode = exports.link = void 0;
exports.getError = getError;
const error_1 = __importDefault(require("@semantic-release/error"));
const package_json_1 = require("../package.json");
const link = (file) => `${package_json_1.homepage}/blob/main/${file}`;
exports.link = link;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["WallyNotInstalled"] = 0] = "WallyNotInstalled";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
exports.ERROR_DEFINITIONS = {
    [ErrorCode.WallyNotInstalled]: {
        message: "Wally is not installed.",
        details: `Wally must be installed to use this plugin. Please install Wally by following the instructions at ${(0, exports.link)("README.md#installation")}.`,
    },
};
function getError(errorCode) {
    const definition = exports.ERROR_DEFINITIONS[errorCode];
    return new error_1.default(definition.message, errorCode.toString(), definition.details);
}
//# sourceMappingURL=error.js.map