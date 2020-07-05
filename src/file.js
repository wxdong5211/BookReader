"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const isFile = (path) => {
    return fs_1.default.lstatSync(path).isFile();
};
const isDir = (path) => {
    return fs_1.default.lstatSync(path).isDirectory();
};
const mkDir = (path) => {
    fs_1.default.mkdirSync(path);
};
const readJsonFile = (path) => {
    if (isFile(path)) {
        const txt = fs_1.default.readFileSync(path);
        return JSON.parse(txt.toString());
    }
    return null;
};
const readJsonDir = (path) => {
    const dirs = fs_1.default.readdirSync(path);
    return isDir(path) ? dirs.map(d => readJsonFile(path + '/' + d)).filter(d => !!d) : [];
};
const readSubDirs = (path) => {
    const dirs = fs_1.default.readdirSync(path);
    return isDir(path) ? dirs.map(d => path + '/' + d).filter(d => isDir(d)) : [];
};
const writeFile = (path, data) => {
    fs_1.default.writeFileSync(path, data);
};
exports.default = { isFile, isDir, mkDir, readJsonFile, readJsonDir, readSubDirs, writeFile };
