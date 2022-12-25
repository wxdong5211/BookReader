"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = __importDefault(require("./file"));
const filterData = file_1.default.readJsonFile('data/filter.json') || {};
exports.clearContents = (content) => {
    const clearContents = filterData.clearContents || [];
    let newContent = content;
    clearContents.forEach(cc => {
        newContent = newContent.replace(cc, '');
    });
    return newContent;
};
