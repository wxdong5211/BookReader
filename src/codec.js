"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const iconv_lite_1 = __importDefault(require("iconv-lite"));
exports.encode = (txt, encode) => {
    return iconv_lite_1.default.encode(txt, encode);
};
exports.decode = (buffer, encode) => {
    return iconv_lite_1.default.decode(buffer, encode);
};
