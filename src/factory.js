"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reader_1 = __importDefault(require("./reader"));
class BRFactory {
    getReader() {
        return new reader_1.default();
    }
}
const factory = new BRFactory();
exports.default = factory;
