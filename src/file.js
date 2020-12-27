"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const isFile = (path) => {
    return fs_1.default.existsSync(path) && fs_1.default.lstatSync(path).isFile();
};
const isDir = (path) => {
    return fs_1.default.existsSync(path) && fs_1.default.lstatSync(path).isDirectory();
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
    const parent = path_1.default.dirname(path.toString());
    if (!isDir(parent)) {
        mkDir(parent);
    }
    fs_1.default.writeFileSync(path, data);
};
const writeJson = (path, data) => {
    writeFile(path, JSON.stringify(data, null, 2));
};
const del = (path) => {
    if (!fs_1.default.existsSync(path)) {
        return;
    }
    if (isDir(path)) {
        fs_1.default.readdirSync(path).forEach(i => del(path + '/' + i));
        fs_1.default.rmdirSync(path);
        return;
    }
    fs_1.default.unlinkSync(path);
};
exports.default = { isFile, isDir, mkDir, readJsonFile, readJsonDir, readSubDirs, writeFile, writeJson, del };
