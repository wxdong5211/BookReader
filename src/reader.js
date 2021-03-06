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
    return {
        "sites": file_1.default.readJsonFile('data/sites/site.json'),
        "books": readBooks(file_1.default.readSubDirs(bookDir))
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
    const title = tag.replace(/<\/?[^>]*>/g, '');
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
    const html = await request.readHtml(path + encodeURI(name));
    let str = html;
    str = str.substring(str.indexOf(search.listStart));
    str = str.substring(0, str.indexOf(search.listEnd));
    const links = str.match(/<a([\s\S]*?)<\/a>/gi) || [];
    const datas = links.map(parseCharLink).filter(c => c != null && c.name.indexOf(name) != -1);
    const arr = datas.map(c => {
        // TODO temp
        const urls = c.url.match(/\d+/gi) || [];
        if (!urls) {
            return null;
        }
        const url = '/book/' + urls[0] + '/';
        c.url = domain + url;
        return c;
    }).filter(c => c != null);
    return arr;
};
const storge = init();
class ReaderImpl {
    async search(name) {
        const sites = storge.sites.filter(i => i.search) || [];
        const list = [];
        for (let i in sites) {
            list.push(...await searchSite(name, sites[i]));
        }
        return list;
    }
    all() {
        return storge.books;
    }
    list(param) {
        return storge.books;
    }
    get(id) {
        return storge.books[id];
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
}
exports.default = ReaderImpl;
