"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const readJsonFile = (path) => {
    const book = fs_1.default.readFileSync(path);
    return JSON.parse(book.toString());
};
const readJsonDir = (path) => {
    const dirs = fs_1.default.readdirSync(path);
    return dirs.map(d => readJsonFile(path + '/' + d));
};
exports.default = { readJsonFile, readJsonDir };
