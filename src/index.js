"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = __importDefault(require("./factory"));
const test = () => {
    const r = factory_1.default.getReader();
    // r.updateAll()
    const book = r.get(1);
    console.log('get book = ', book);
    // const ret = book.updateDir()
    // console.log('updateDir ret = ', ret)
    // const ret = book.getChars()
    // console.log('getChars ret = ', ret)
    // const ret = book.getChar(0)
    // console.log('getChar ret = ', ret)
    const idx = 2;
    const ret1 = book.updateChar(idx);
    console.log('updateChar ret = ', ret1);
    const ret2 = book.exportChar(idx);
    console.log('exportChar ret = ', ret2);
};
test();
