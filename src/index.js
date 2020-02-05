"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = __importDefault(require("./factory"));
const sort_1 = require("./sort");
const test = () => {
    const r = factory_1.default.getReader();
    // r.updateAll()
    const book = r.get(1);
    console.log('get book = ', book);
    // const ret = book.updateDir()
    // console.log('updateDir ret = ', ret)
    const ret = book.getChars();
    // console.log('getChars ret = ', ret)
    const ret1 = sort_1.sortChars(ret);
    ret1.forEach(r => console.log(r.title));
    // const ret = book.getChar(0)
    // console.log('getChar ret = ', ret)
    // const ret = book.getCharsUntil(1,3)
    // console.log('getCharsUntil ret = ', ret)
    // const idx = 4;
    // const ret1 = book.updateChar(idx)
    // console.log('updateChar ret = ', ret1)
    // const ret2 = book.exportChar(idx)
    // console.log('exportChar ret = ', ret2)
    // const ret = book.updateCharUntil(1, 10)
    // console.log('updateCharUntil ret = ', ret)
    // const ret = book.exportCharUntil(1, 5)
    // console.log('exportCharUntil ret = ', ret)
};
test();
