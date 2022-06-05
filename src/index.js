"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = __importDefault(require("./factory"));
const readline_1 = __importDefault(require("readline"));
const test = async () => {
    // await search('霍格沃茨的诡秘行者')
    // await updateDirs()
    await updateChars();
    // await exportChars()
};
const search = async (name) => {
    const r = factory_1.default.getReader();
    const books = await r.search(name);
    console.log(books);
    if (books && books.length > 0) {
        if (books.length === 1) {
            console.log('auto anwser is ', 0);
            r.add(books[0]);
        }
        else {
            const anwser = await waitHumanAction(books.length);
            console.log('human anwser is ', anwser);
            const bookSeq = parseInt(anwser.trim());
            if (!isNaN(bookSeq) && bookSeq > -1 && bookSeq < books.length) {
                r.add(books[bookSeq]);
            }
            else {
                console.error('bookSeq is not ok', anwser);
            }
        }
    }
    // r.add({
    //   id: 37,
    //   name:'我老婆是邪神',
    //   url:'https://www.boquku.com/book/125937/'
    // })
};
const waitHumanAction = (len) => new Promise((resolve, reject) => {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('which[' + len + ']? ', anwser => {
        resolve(anwser);
        rl.close();
    });
});
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
const updateChars = async () => {
    const r = factory_1.default.getReader();
    r.updateChars();
};
const exportChars = async () => {
    const r = factory_1.default.getReader();
    r.exportChars();
};
const updateDirs = async () => {
    const r = factory_1.default.getReader();
    r.updateDirs();
};
test();
