"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const readJsonFile = (path) => {
    const stat = fs_1.default.lstatSync(path);
    if (stat.isFile()) {
        const book = fs_1.default.readFileSync(path);
        return JSON.parse(book.toString());
    }
    return null;
};
const readJsonDir = (path) => {
    const dirs = fs_1.default.readdirSync(path);
    return dirs.map(d => readJsonFile(path + '/' + d)).filter(d => !!d);
};
const writeFile = (path, data) => {
    fs_1.default.writeFileSync(path, data);
};
exports.default = { readJsonFile, readJsonDir, writeFile };
