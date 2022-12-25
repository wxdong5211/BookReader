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
const sort_1 = require("./sort");
const filter_1 = require("./filter");
const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
const parseCharLink = (tag, idx) => {
    const hrefStart = 'href="';
    const hrefTag = tag.replace(/href[\s]*=[\s]*"/gi, 'href="');
    const hrefIdx = hrefTag.indexOf(hrefStart);
    if (hrefIdx === -1) {
        return null;
    }
    let href = hrefTag.substr(hrefIdx + hrefStart.length);
    href = href.substr(0, href.indexOf('"'));
    const title = hrefTag.replace(/<\/?[^>]*>/g, '').trim();
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
    const noReapet = dirHtml ? [...new Set(dirHtml)] : [];
    return noReapet.map(parseCharLink).filter(c => c != null);
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
    const req = await request.readHtml(url);
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
    return request.readHtml(url);
};
const subCharHtml = (book, req) => {
    const start = book.block.charStart;
    const end = book.block.charEnd;
    req = req.substr(req.indexOf(start) + start.length);
    req = req.substr(0, req.indexOf(end));
    req = req.replace(/&nbsp;/g, ' ');
    req = req.replace(/　/g, ' ');
    req = req.replace(/<br\s*\/>/g, '\n');
    req = req.replace(/<script\s+\S*>.*<\/script>/g, '');
    req = req.replace(/<\/?.+?\/?>/g, '');
    req = req.replace(/\n\s+\n/g, '\n');
    req = req.trim();
    req = filter_1.clearContents(req);
    if (book.block.filter && req.indexOf(book.block.filter) === 0) {
        req = '';
    }
    return req;
};
const getMaxCharId = (chars) => {
    if (chars == null || chars.length === 0) {
        return 0;
    }
    let max = 0;
    chars.forEach(x => {
        if (max < x.order) {
            max = x.order;
        }
    });
    return max;
};
const updateDirFunc = async (book) => {
    try {
        const chars = readCharsData(book) || [];
        const urls = chars.map(i => i.url);
        const max = getMaxCharId(chars);
        let remoteChars = await readDir(book);
        if (book.reSort === 'sort') {
            remoteChars = sort_1.sortChars(remoteChars);
        }
        else if (book.reSort === 'sortNum') {
            remoteChars = sort_1.sortNumChars(remoteChars);
        }
        let num = 0;
        remoteChars.forEach(v => {
            if (urls.indexOf(v.url) != -1) {
                return;
            }
            num += 1;
            v.order = max + num;
            v.disOrder = v.order;
            chars.push(v);
        });
        writeBookChars(book, chars);
        return new api.UpdateDirResult(chars, num);
    }
    catch (e) {
        console.error('problem with request: ' + e.message);
    }
    return new api.UpdateDirResult([], 0);
};
const updateAll = async (book) => {
    try {
        const { chars } = await updateDirFunc(book);
        await updateChars(book, chars, false);
        writeBookChars(book, chars);
    }
    catch (e) {
        console.error('problem with updateAll: ' + e.message);
    }
};
const updateChars = async (book, chars, force) => {
    let skip = 0;
    let done = 0;
    let error = 0;
    try {
        for (let x in chars) {
            if (!force && chars[x].state === api.CharcterState.Done) {
                skip++;
                continue;
            }
            await sleep(100); //TODO interval by config
            const state = await updateCharFunc(book, chars[x]);
            if (state === api.CharcterState.Done) {
                done++;
            }
            else {
                error++;
            }
        }
    }
    catch (e) {
        console.error('problem with updateChars: ' + e.message);
    }
    return new api.UpdateCharResult(chars.length, skip, done, error);
};
const updateCharFunc = async (book, char) => {
    try {
        console.log(`${book.id}:${char.id}->${book.name}:${char.title},${char.url},${char.create},${char.disOrder},${char.order},${char.state}`);
        const data = await readChar(book, char);
        const html = subCharHtml(book, data);
        // const oldData = readCharFullData(book,char.id)
        // if(oldData == null){
        //   return api.CharcterState.Init
        // }
        // const html = clearContents(oldData.data)
        let state = api.CharcterState.Done;
        if (!html || html.length < 20) {
            state = api.CharcterState.Init;
        }
        const charFull = Object.assign({ data: html }, char, { create: new Date(), state: state });
        writeBookChar(book, charFull);
        char.state = state;
        return state;
    }
    catch (e) {
        console.error('problem with request: ' + e.message);
        char.state = api.CharcterState.Error;
        return char.state;
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
        this.reSort = book.reSort;
        this.encode = book.encode;
        this.interval = book.interval;
        this.block = book.block;
    }
    update() {
        updateAll(this);
        writeBook('data/test.json', this);
        return '123asd';
    }
    async updateDir() {
        const result = await updateDirFunc(this);
        return result;
    }
    async updateChar(id) {
        const state = await updateCharFunc(this, this.getChar(id));
        return `update result ${state}`;
    }
    async updateCharScope(from, until) {
        try {
            const charsAll = (this.getChars() || []);
            const chars = charsAll.slice(from, until);
            const result = await updateChars(this, chars, false);
            writeBookChars(this, charsAll);
            return result;
        }
        catch (e) {
            console.error('problem with updateCharUntil: ' + e.message);
        }
        return null;
    }
    exportChar(id) {
        const charFull = readCharFullData(this, id);
        if (charFull === null) {
            return '';
        }
        const data = (charFull.data || '');
        const title = charFull.title || '';
        // return `<div><h3>${title}</h3><p>${data}</p></div>`;
        return `${title}\n${data}`;
    }
    exportCharScope(from, until) {
        const chars = this.getCharsScope(from, until) || [];
        const head = `${this.name}\n\n`;
        return head + chars.map(c => this.exportChar(c.id)).join('\n\n');
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
    getLastUpdateChar(from) {
        const chars = this.getChars();
        if (!chars) {
            return undefined;
        }
        const charsCopy = [...chars];
        const formIdx = from != null && from > -1 ? from : 0;
        const lastIdx = charsCopy.findIndex(i => i.order > formIdx && i.state !== api.CharcterState.Done);
        if (lastIdx === -1) {
            return charsCopy[charsCopy.length - 1];
        }
        if (lastIdx === 0) {
            return charsCopy[0];
        }
        return charsCopy[lastIdx - 1];
    }
    getLastChar() {
        const chars = this.getChars();
        return !chars ? undefined : chars[chars.length - 1];
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
    reOrder() {
        const chars = sort_1.sortChars(this.getChars() || []);
        chars.forEach((c, i) => {
            c.order = i;
            c.disOrder = i;
        });
        writeBookChars(this, chars);
    }
}
exports.default = BookImpl;
