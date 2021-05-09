"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = __importDefault(require("./factory"));
const test = async () => {
    // await search('刺客之王')
    // await updateDirs(33, 49)
    // await updateChars(49, 0)
    await exportChars(49, 0);
};
const search = async (name) => {
    const r = factory_1.default.getReader();
    const books = await r.search(name);
    console.log(books);
    if (books && books.length == 1) {
        r.add(books[0]);
        
    }
};
const test1 = async () => {
    const r = factory_1.default.getReader();
    // r.updateAll()
    const book = r.get(18);
    console.log('get book = ', book);
    // r.del(book)
    const ret = await book.updateDir();
    console.log('updateDir ret = ', ret);
    // const ret = book.getChars()
    // console.log('getChars ret = ', ret)
    // const ret1 = sortChars(ret)
    // ret1.forEach(r=>console.log(r.title))
    // const ret = book.getChar(0)
    // console.log('getChar ret = ', ret)
    // const ret = book.getCharsScope(1,3)
    // console.log('getCharsScope ret = ', ret)
    // const idx = 233;
    // const ret1 = await book.updateChar(idx)
    // console.log('updateChar ret = ', ret1)
    // const ret2 = book.exportChar(idx)
    // console.log('exportChar ret = ', ret2)
    // const ret = book.updateCharScope(1, 10)
    // console.log('updateCharScope ret = ', ret)
    // const ret = book.exportCharScope(1, 5)
    // console.log('exportCharScope ret = ', ret)
    // console.log('getCharsLength ret = ', book.getCharsLength())
    // const ret = await book.updateCharScope(691)
    // console.log('updateCharScope ret = ', ret)
    // const ret = book.exportCharScope(100)
    // console.log('exportCharScope ret = ', ret)
    // book.updateCharState(1, 1)
    // console.log('updateCharState')
    // book.updateCharStateScope(0, 0)
    // console.log('updateCharStateScope')
    // const ret = book.exportTxtScope(691)
    // console.log('exportTxtScope ret = ', ret)
};
const updateChars = async (idx, start) => {
    const r = factory_1.default.getReader();
    const book = r.get(idx);
    const ret = await book.updateCharScope(start);
    console.log(idx + ' ' + book.name + ' ' + book.id + ' start ' + start + ' updateCharScope ret = ', ret);
    // const ret = book.exportTxtScope(691)
    // console.log('exportTxtScope ret = ', ret)
};
const exportChars = async (idx, start) => {
    const r = factory_1.default.getReader();
    const book = r.get(idx);
    const ret = await book.exportTxtScope(start);
    console.log(idx + ' ' + book.name + ' ' + book.id + ' start ' + start + ' exportTxtScope ret = ', ret);
};
const updateDirs = async (start, end) => {
    const r = factory_1.default.getReader();
    for (let i = start; i <= end; i++) {
        const book = r.get(i);
        if (book) {
            const ret = await book.updateDir();
            console.log(i + ' ' + book.name + ' ' + book.id + ' updateDir ret = ', ret);
        }
    }
};
test();
