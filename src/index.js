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
const url_1 = __importDefault(require("url"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const parseUrl = (urlStr) => {
    const urlObj = url_1.default.parse(urlStr);
    const option = {
        protocol: urlObj.protocol,
        host: urlObj.host,
        hostname: urlObj.hostname,
        port: urlObj.port,
        method: 'GET',
        path: urlObj.path,
        headers: {},
        timeout: 10
    };
    console.log(option);
    return option;
};
const request = (options) => new Promise((resolve, reject) => {
    const cb = (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                resolve(rawData);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    const httpMod = options.protocol === 'https:' ? https_1.default.request : http_1.default.request;
    const req = httpMod(options, cb);
    req.on('error', e => reject(e));
    // req.write(data)
    req.end();
});
const read = (book) => __awaiter(this, void 0, void 0, function* () {
    try {
        const option = parseUrl(book.url);
        let req = yield request(option);
        const start = book.block.dirStart;
        const end = book.block.dirEnd;
        req = req.substr(req.indexOf(start) + start.length);
        req = req.substr(0, req.indexOf(end));
        const xx = req.match(/<a.*href=".*".*>.*<\/a>/gi);
        if (xx) {
            const hrefStart = 'href="';
            let idx = 0;
            const chars = xx.map(x => {
                let href = x.substr(x.indexOf(hrefStart) + hrefStart.length);
                href = href.substr(0, href.indexOf('"'));
                const title = x.replace(/<\/?[^>]*>/g, '');
                const charcter = {
                    url: href,
                    title: title,
                    create: new Date(),
                    disOrder: idx,
                    order: idx
                };
                idx++;
                console.log(charcter);
                return charcter;
            });
        }
    }
    catch (e) {
        console.log('problem with request: ' + e.message);
    }
});
const readJsonFile = (path) => {
    const book = fs_1.default.readFileSync(path);
    return JSON.parse(book.toString());
};
const readJsonDir = (path) => {
    const dirs = fs_1.default.readdirSync(path);
    return dirs.map(d => readJsonFile(path + '/' + d));
};
const init = () => {
    return {
        "sites": readJsonDir('data/sites'),
        "books": readJsonDir('data/books')
    };
};
const test = () => {
    const book = init();
    console.log(book);
    read(book.books[0]);
};
test();
