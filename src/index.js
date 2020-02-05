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
    // const ret1 = sortChars(ret)
    // ret1.forEach(r=>console.log(r.title))
    // const ret = book.getChar(0)
    // console.log('getChar ret = ', ret)
    // const ret = book.getCharsScope(1,3)
    // console.log('getCharsScope ret = ', ret)
    // const idx = 4;
    // const ret1 = book.updateChar(idx)
    // console.log('updateChar ret = ', ret1)
    // const ret2 = book.exportChar(idx)
    // console.log('exportChar ret = ', ret2)
    // const ret = book.updateCharScope(1, 10)
    // console.log('updateCharScope ret = ', ret)
    // const ret = book.exportCharScope(1, 5)
    // console.log('exportCharScope ret = ', ret)
    // console.log('getCharsLength ret = ', book.getCharsLength())
    // const ret = book.updateCharScope(33)
    // console.log('updateCharScope ret = ', ret)
    // const ret = book.exportCharScope(100)
    // console.log('exportCharScope ret = ', ret)
    const ret = book.exportTxtScope(100);
    console.log('exportTxtScope ret = ', ret);
};
test();
