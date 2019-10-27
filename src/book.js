"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("./request"));
const file_1 = __importDefault(require("./file"));
const api = __importStar(require("./api"));
const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
const readHtml = async (url) => {
    const option = request_1.default.parseUrl(url);
    const req = await request_1.default.request(option);
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
        state: api.CharcterState.Init
    };
    return charcter;
};
const parseDir = (book, req) => {
    const dirHtml = req.match(/<a.*href=".*".*>.*<\/a>/gi);
    return dirHtml ? dirHtml.map(parseCharLink) : [];
};
const subDirHtml = (book, req) => {
    const start = book.block.dirStart;
    const end = book.block.dirEnd;
    req = req.substr(req.indexOf(start) + start.length);
    req = req.substr(0, req.indexOf(end));
    return req;
};
const readDir = async (book) => {
    const req = await readHtml(book.url);
    return parseDir(book, subDirHtml(book, req));
};
const readChar = (book, char) => {
    let url = char.url;
    if (!url.startsWith('http://') || !url.startsWith('https://')) {
        url = book.url + (book.url.endsWith('/') ? '' : '/') + url;
    }
    return readHtml(url);
};
const subCharHtml = (book, req) => {
    const start = book.block.charStart;
    const end = book.block.charEnd;
    req = req.substr(req.indexOf(start) + start.length);
    req = req.substr(0, req.indexOf(end));
    req = req.replace(/&nbsp;/g, ' ');
    req = req.replace(/<br \/>/g, '\n');
    return req;
};
const updateDirFunc = async (book) => {
    try {
        const chars = await readDir(book);
        writeChars(book.location + '/chars.json', chars);
        return chars;
    }
    catch (e) {
        console.log('problem with request: ' + e.message);
    }
    return [];
};
const updateAll = async (book) => {
    try {
        const chars = await updateDirFunc(book);
        for (let x in chars) {
            await sleep(100);
            await updateCharFunc(book, chars[x], x);
        }
    }
    catch (e) {
        console.log('problem with request: ' + e.message);
    }
};
const updateCharFunc = async (book, char, id) => {
    try {
        console.log(new Date());
        console.log(char);
        const data = await readChar(book, char);
        writeCharData(book.location + '/chars/' + id + '.json', subCharHtml(book, data));
    }
    catch (e) {
        console.log('problem with request: ' + e.message);
    }
};
const readCharsData = (book) => {
    try {
        const data = file_1.default.readJsonFile(book.location + '/chars.json');
        return (data || {}).chars;
    }
    catch (e) {
        console.log('problem with request: ' + e.message);
    }
    return [];
};
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
class BookImpl {
    constructor(book) {
        this.url = book.url;
        this.location = book.location;
        this.method = book.method;
        this.encode = book.encode;
        this.interval = book.interval;
        this.block = book.block;
    }
    update() {
        updateAll(this);
        writeBook('data/test.json', this);
        return '123asd';
    }
    updateDir() {
        updateDirFunc(this);
        return '123asd';
    }
    updateChar(id) {
        updateCharFunc(this, this.getChar(id), id + '');
        return '123asd';
    }
    getChars() {
        return readCharsData(this);
    }
    getChar(id) {
        return (this.getChars() || [])[id];
    }
}
exports.default = BookImpl;
