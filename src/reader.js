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
const book_1 = __importDefault(require("./book"));
const bookDir = 'data/books';
const readBooks = (dirs) => {
    return dirs.map(readBook).sort((a, b) => a.id - b.id);
};
const readBook = (dir) => {
    const book = file_1.default.readJsonFile(dir + '/book.json');
    book.location = dir;
    return new book_1.default(book);
};
const maxBookId = () => {
    const books = storge.books;
    if (books) {
        return books[books.length - 1].id;
    }
    return 0;
};
const init = () => {
    const books = readBooks(file_1.default.readSubDirs(bookDir));
    const booksMap = {};
    books.forEach((v, i) => {
        booksMap[v.id] = i;
    });
    return {
        "sites": file_1.default.readJsonFile('data/sites/site.json'),
        "books": books,
        "booksMap": booksMap,
    };
};
const parseCharLink = (tag, idx) => {
    const hrefStart = 'href="';
    const hrefIdx = tag.indexOf(hrefStart);
    if (hrefIdx === -1) {
        return null;
    }
    let href = tag.substr(hrefIdx + hrefStart.length);
    href = href.substr(0, href.indexOf('"'));
    const title = tag.replace(/<\/?[^>]*>/g, '').trim();
    const charcter = {
        id: idx,
        url: href,
        name: title
    };
    return charcter;
};
const searchSite = async (name, site) => {
    const search = site.search;
    const domain = site.protocol + '//' + site.host;
    const path = domain + search.path;
    const type = search.type;
    const html = await request.readHtml(path + encodeURI(name));
    let str = html;
    str = str.substring(str.indexOf(search.listStart));
    str = str.substring(0, str.indexOf(search.listEnd));
    const links = str.match(/<a([\s\S]*?)<\/a>/gi) || [];
    const datas = links.map(parseCharLink).filter(c => c != null && c.name.indexOf(name) != -1);
    const arr = datas.map(c => {
        // TODO temp
        if (type === 'cutNumber') {
            const urls = c.url.match(/\d+/gi) || [];
            if (!urls) {
                return null;
            }
            const url = '/book/' + urls[0] + '/';
            c.url = domain + url;
        }
        else {
            if (c.url.indexOf('http://') !== 0 && c.url.indexOf('https://') !== 0) {
                c.url = domain + c.url;
            }
        }
        return c;
    }).filter(c => c != null);
    return arr;
};
const getBooksUpdateMap = (books) => {
    const booksMap = {};
    let book;
    for (let i in books) {
        book = books[i];
        booksMap[book.id] = Object.assign({}, book);
    }
    return booksMap;
};
const storge = init();
class ReaderImpl {
    async search(name) {
        const sites = storge.sites.filter(i => i.search && !i.search.skip) || [];
        const list = [];
        for (let i in sites) {
            try {
                list.push(...await searchSite(name, sites[i]));
            }
            catch (e) {
                console.error('search ' + name + ' fail', sites[i], e);
            }
        }
        list.forEach((v, i) => { v.id = i; });
        return list;
    }
    all() {
        return storge.books;
    }
    list(param) {
        return storge.books;
    }
    get(id) {
        return storge.books[storge.booksMap[id]];
    }
    update(book) {
        if (typeof book === 'number') {
            book = this.get(book);
        }
        book.update();
        return '123';
    }
    add(book) {
        book.id = maxBookId() + 1;
        const option = request.parseUrl(book.url);
        const site = storge.sites.find(i => i.host === option.host && i.protocol === option.protocol);
        book.block = (site || {}).block;
        book.reSort = (site || {}).reSort;
        file_1.default.writeJson(bookDir + '/' + book.id + '/book.json', book);
        return '123';
    }
    del(book) {
        if (typeof book === 'number') {
            book = this.get(book);
            if (book == null) {
                return 'nobook';
            }
        }
        file_1.default.del(bookDir + '/' + book.id);
        return '123';
    }
    updateAll() {
        storge.books.map(this.update);
        return '123';
    }
    async updateDirs() {
        const booksData = file_1.default.readJsonFile('data/books.json') || {};
        const books = booksData.books || [];
        const newBooks = [];
        const booksMap = getBooksUpdateMap(books);
        const allBooks = this.all();
        for (let i in allBooks) {
            const book = allBooks[i];
            if (book) {
                let bookUpdateData = booksMap[book.id];
                if (!bookUpdateData) {
                    const lastReadChar = book.getLastUpdateChar() || { title: '', order: 0 };
                    bookUpdateData = {
                        id: book.id,
                        name: book.name,
                        readNum: lastReadChar.order,
                        readChar: lastReadChar.title
                    };
                }
                const { chars, num } = await book.updateDir();
                const lastChar = chars == null || chars.length === 0 ? { title: '', order: 0 } : chars[chars.length - 1];
                bookUpdateData.num = num;
                bookUpdateData.lastNum = lastChar.order;
                bookUpdateData.lastChar = lastChar.title;
                console.log(i + ' updateDir ret = ', bookUpdateData);
                newBooks.push(bookUpdateData);
            }
        }
        booksData.books = newBooks;
        file_1.default.writeJson('data/books.json', booksData);
        return '123';
    }
    async updateChars() {
        const booksData = file_1.default.readJsonFile('data/books.json') || {};
        const books = booksData.books || [];
        const newResults = [];
        const booksMap = getBooksUpdateMap(books);
        const allBooks = this.all();
        for (let i in allBooks) {
            const book = allBooks[i];
            if (book) {
                let bookUpdateData = booksMap[book.id];
                if (bookUpdateData) {
                    const result = await book.updateCharScope(bookUpdateData.readNum);
                    console.log(i + ` update chars `, Object.assign({}, bookUpdateData, result));
                    newResults.push(Object.assign({}, bookUpdateData, result, { idx: i }));
                }
            }
        }
        newResults.forEach(i => console.log(` update chars ${i.idx}:${i.id}:${i.name},${i.readNum}:${i.readChar}->${i.lastNum}:${i.lastChar},${i.num},${i.total},${i.skip},${i.done},${i.error}`));
        return '123';
    }
    exportChars() {
        const booksData = file_1.default.readJsonFile('data/books.json') || {};
        const books = booksData.books || [];
        const newBooks = [];
        const booksMap = getBooksUpdateMap(books);
        const allBooks = this.all();
        for (let i in allBooks) {
            const book = allBooks[i];
            if (book) {
                let bookUpdateData = booksMap[book.id];
                if (bookUpdateData) {
                    if (bookUpdateData.readNum !== bookUpdateData.lastNum || bookUpdateData.lastNum === 0) {
                        const ret = book.exportTxtScope(bookUpdateData.readNum);
                        bookUpdateData.num = 0;
                        const lastReadChar = book.getLastUpdateChar(bookUpdateData.readNum) || { title: '', order: 0 };
                        bookUpdateData.readNum = lastReadChar.order;
                        bookUpdateData.readChar = lastReadChar.title;
                        console.log(i + ' exportChars ret = ', bookUpdateData);
                    }
                }
                else {
                    const lastReadChar = book.getLastUpdateChar() || { title: '', order: 0 };
                    bookUpdateData = {
                        id: book.id,
                        name: book.name,
                        readNum: lastReadChar.order,
                        readChar: lastReadChar.title
                    };
                }
                newBooks.push(bookUpdateData);
            }
        }
        booksData.books = newBooks;
        file_1.default.writeJson('data/books.json', booksData);
        return '123';
    }
}
exports.default = ReaderImpl;
