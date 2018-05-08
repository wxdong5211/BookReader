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
const request = (urlStr) => new Promise((resolve, reject) => {
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
    const option = parseUrl(urlStr);
    const httpMod = option.protocol === 'https:' ? https_1.default.request : http_1.default.request;
    const req = httpMod(option, cb);
    req.on('error', function (e) {
        reject(e);
    });
    // req.write(data)
    req.end();
});
const read = (book) => __awaiter(this, void 0, void 0, function* () {
    try {
        let req = yield request(book.url);
        const start = '<div id="yulan">';
        const end = '</div>';
        req = req.substr(req.indexOf(start) + start.length);
        req = req.substr(0, req.indexOf(end));
        console.log(req);
    }
    catch (e) {
        console.log('problem with request: ' + e.message);
    }
});
const test = () => {
    read({ url: 'http://www.80txt.com/txtml_69001.html' });
};
test();
