"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("./request"));
const file_1 = __importDefault(require("./file"));
var CharcterState;
(function (CharcterState) {
    CharcterState[CharcterState["Init"] = 0] = "Init";
    CharcterState[CharcterState["Done"] = 1] = "Done";
    CharcterState[CharcterState["Error"] = 2] = "Error";
})(CharcterState || (CharcterState = {}));
const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
const readHtml = (url) => __awaiter(this, void 0, void 0, function* () {
    const option = request_1.default.parseUrl(url);
    let req = yield request_1.default.request(option);
    return req;
});
const readChar = (char) => {
    return readHtml(char.url);
};
const subDirHtml = (book, req) => {
    const start = book.block.dirStart;
    const end = book.block.dirEnd;
    req = req.substr(req.indexOf(start) + start.length);
    req = req.substr(0, req.indexOf(end));
    return req;
};
const subCharHtml = (book, req) => {
    const start = book.block.charStart;
    const end = book.block.charEnd;
    req = req.substr(req.indexOf(start) + start.length);
    req = req.substr(0, req.indexOf(end));
    return req;
};
const parseCharLink = (tag, idx) => {
    const hrefStart = 'href="';
    let href = tag.substr(tag.indexOf(hrefStart) + hrefStart.length);
    href = href.substr(0, href.indexOf('"'));
    const title = tag.replace(/<\/?[^>]*>/g, '');
    const charcter = {
        url: href,
        title: title,
        create: new Date(),
        disOrder: idx,
        order: idx,
        state: CharcterState.Init
    };
    return charcter;
};
const parseDir = (book, req) => {
    const dirHtml = req.match(/<a.*href=".*".*>.*<\/a>/gi);
    return dirHtml ? dirHtml.map(parseCharLink) : [];
};
const readDir = (book) => __awaiter(this, void 0, void 0, function* () {
    let req = yield readHtml(book.url);
    return parseDir(book, subDirHtml(book, req));
});
const updateDir = (book) => __awaiter(this, void 0, void 0, function* () {
    try {
        const chars = yield readDir(book);
        writeChars('data/books/chars.json', chars);
        for (let x in chars) {
            yield sleep(100);
            console.log(new Date());
            console.log(chars[x]);
            const data = yield readChar(chars[x]);
            writeCharData('data/books/chars/' + x + '.json', subCharHtml(book, data));
        }
    }
    catch (e) {
        console.log('problem with request: ' + e.message);
    }
});
const writeChars = (path, chars) => {
    writeJson(path, { chars });
};
const writeChar = (path, char) => {
    writeJson(path, char);
};
const writeCharData = (path, data) => {
    writeJson(path, { data });
};
const writeBook = (path, book) => {
    writeJson(path, book);
};
const writeJson = (path, data) => {
    file_1.default.writeFile(path, JSON.stringify(data, null, 2));
};
const init = () => {
    return {
        "sites": file_1.default.readJsonDir('data/sites'),
        "books": file_1.default.readJsonDir('data/books')
    };
};
const test = () => {
    const book = init();
    console.log(book);
    updateDir(book.books[0]);
    writeBook('data/test.json', book.books[0]);
};
test();
