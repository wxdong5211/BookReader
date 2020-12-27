"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = __importStar(require("./request"));
const file_1 = __importDefault(require("./file"));
const api = __importStar(require("./api"));
const codec_1 = require("./codec");
const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
const readHtml = async (url) => {
    const option = request.parseUrl(url);
    const req = await request.request(option);
    return req;
};
const parseCharLink = (tag, idx) => {
    const hrefStart = 'href="';
    const hrefIdx = tag.indexOf(hrefStart);
    if (hrefIdx === -1) {
        return null;
    }
    let href = tag.substr(hrefIdx + hrefStart.length);
    href = href.substr(0, href.indexOf('"'));
    const title = tag.replace(/<\/?[^>]*>/g, '');
    const charcter = {
        id: idx,
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
    const dirHtml = req.match(/<a([\s\S]*?)<\/a>/gi);
    return dirHtml ? dirHtml.map(parseCharLink).filter(c => c != null) : [];
};
const subDirHtml = (book, req) => {
    const start = book.block.dirStart;
    const end = book.block.dirEnd;
    req = req.substr(req.indexOf(start) + start.length);
    req = req.substr(0, req.indexOf(end));
    return req;
};
const readDir = async (book) => {
    let url = book.url;
    if (book.commonUrlParam) {
        const paramIdx = url.indexOf('?');
        url += (paramIdx === -1 ? '?' : '&') + book.commonUrlParam;
    }
    const req = await readHtml(url);
    return parseDir(book, subDirHtml(book, req));
};
const readChar = (book, char) => {
    let url = char.url;
    if (!url.startsWith('http://') || !url.startsWith('https://')) {
        if (url.startsWith('/')) {
            const proIdx = book.url.indexOf('//');
            const pathIdx = book.url.indexOf('/', proIdx + 2);
            const domain = book.url.substr(0, pathIdx);
            url = domain + url;
        }
        else {
            const paramIdx = book.url.indexOf('?');
            const path = paramIdx === -1 ? book.url : book.url.substr(0, paramIdx);
            if (path.endsWith('/')) {
                url = path + url;
            }
            else {
                url = path.substr(0, path.lastIndexOf('/') + 1) + url;
            }
        }
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
        writeBookChars(book, chars);
        return chars;
    }
    catch (e) {
        console.error('problem with request: ' + e.message);
    }
    return [];
};
const updateAll = async (book) => {
    try {
        const chars = await updateDirFunc(book);
        await updateChars(book, chars, false);
        writeBookChars(book, chars);
    }
    catch (e) {
        console.error('problem with updateAll: ' + e.message);
    }
};
const updateChars = async (book, chars, force) => {
    try {
        for (let x in chars) {
            if (!force && chars[x].state === api.CharcterState.Done) {
                continue;
            }
            await sleep(100); //TODO interval by config
            await updateCharFunc(book, chars[x]);
        }
    }
    catch (e) {
        console.error('problem with updateChars: ' + e.message);
    }
};
const updateCharFunc = async (book, char) => {
    try {
        console.log(char);
        const data = await readChar(book, char);
        const html = subCharHtml(book, data);
        let state = api.CharcterState.Done;
        if (!html) {
            state = api.CharcterState.Init;
        }
        const charFull = Object.assign({ data: html }, char, { create: new Date(), state: state });
        writeBookChar(book, charFull);
        char.state = state;
    }
    catch (e) {
        console.error('problem with request: ' + e.message);
        char.state = api.CharcterState.Error;
    }
};
const readCharsData = (book) => {
    try {
        const data = file_1.default.readJsonFile(book.location + '/chars.json');
        return (data || {}).chars;
    }
    catch (e) {
        console.error('problem with readCharsData: ' + e.message);
    }
    return [];
};
const readCharFullData = (book, id) => {
    try {
        return file_1.default.readJsonFile(book.location + '/chars/' + id + '.json');
    }
    catch (e) {
        console.error('problem with readCharFullData: ' + e.message);
    }
    return null;
};
const writeBookChars = (book, chars) => {
    file_1.default.writeJson(book.location + '/chars.json', { chars });
};
const writeBookChar = (book, char) => {
    file_1.default.writeJson(book.location + '/chars/' + char.id + '.json', char);
};
const writeBook = (path, book) => {
    file_1.default.writeJson(path, book);
};
const writeTxt = (path, data) => {
    file_1.default.writeFile(path, data);
};
class BookImpl {
    constructor(book) {
        this.id = book.id;
        this.name = book.name;
        this.url = book.url;
        this.location = book.location;
        this.method = book.method;
        this.commonUrlParam = book.commonUrlParam;
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
        updateCharFunc(this, this.getChar(id));
        return '123asd';
    }
    async updateCharScope(from, until) {
        try {
            const charsAll = (this.getChars() || []);
            const chars = charsAll.slice(from, until);
            await updateChars(this, chars, false);
            writeBookChars(this, charsAll);
        }
        catch (e) {
            console.error('problem with updateCharUntil: ' + e.message);
        }
        return '123asd';
    }
    exportChar(id) {
        const charFull = readCharFullData(this, id);
        if (charFull === null) {
            return '';
        }
        const data = (charFull.data || '').replace(/<br\/>/g, '\n');
        const title = charFull.title || '';
        // return `<div><h3>${title}</h3><p>${data}</p></div>`;
        return `${title}\n${data}`;
    }
    exportCharScope(from, until) {
        const chars = this.getCharsScope(from, until) || [];
        const head = `${this.name}\n`;
        return head + chars.map(c => this.exportChar(c.id)).join('\n');
    }
    exportTxtScope(from, until) {
        const txt = this.exportCharScope(from, until);
        const file = `${this.name}.txt`;
        const encodeCfg = this.encode;
        if (encodeCfg) {
            writeTxt(this.location + '/' + file, codec_1.encode(txt, encodeCfg));
        }
        else {
            writeTxt(this.location + '/' + file, txt);
        }
        return 'asdsad';
    }
    getChars() {
        return readCharsData(this);
    }
    getCharsLength() {
        return (this.getChars() || []).length;
    }
    getChar(id) {
        return (this.getCharsScope(id, id + 1) || [])[0];
    }
    updateCharState(state, id) {
        this.updateCharStateScope(state, id, id + 1);
    }
    updateCharStateScope(state, from, until) {
        const chars = (this.getChars() || []);
        const arr = chars.slice(from, until);
        let tag = false;
        for (let x in arr) {
            const id = arr[x].id;
            const charFull = readCharFullData(this, id);
            if (charFull !== null) {
                tag = true;
                charFull.state = state;
                writeBookChar(this, charFull);
                const char = chars[id];
                if (char) {
                    char.state = state;
                }
            }
        }
        if (tag) {
            writeBookChars(this, chars);
        }
    }
    getCharsScope(from, until) {
        const chars = (this.getChars() || []);
        return chars.slice(from, until);
    }
}
exports.default = BookImpl;
