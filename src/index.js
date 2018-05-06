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
console.log('hi123asdasd');
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
                // const parsedData = JSON.parse(rawData);
                // console.log(rawData);
                resolve(rawData);
            }
            catch (e) {
                console.error(e.message);
                reject(e);
            }
        });
    };
    const option = parseUrl(urlStr);
    const httpMod = option.protocol === 'https:' ? https_1.default.request : http_1.default.request;
    const req = httpMod(option, cb);
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        reject(e);
    });
    // req.write(data)
    req.end();
});
const test = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const req = yield request('https://www.baidu.com:81');
        console.log(req);
    }
    catch (e) {
        console.error(e.message);
    }
});
test();
