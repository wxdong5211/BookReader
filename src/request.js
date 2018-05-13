"use strict";
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
exports.default = { request, parseUrl };
