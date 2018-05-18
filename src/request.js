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
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            // 'Accept-Encoding': 'gzip, deflate',
            // 'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
            // 'Connection': 'keep-alive',
            'host': urlObj.host,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
        },
        timeout: 10
    };
    console.log(option);
    return option;
};
const request = (options) => new Promise((resolve, reject) => {
    const cb = (res) => {
        // if(options.host === 'www.qiushu.cc'){
        //   res.setEncoding('gbk');
        // } else {
        // res.setEncoding('utf8');
        // }
        let rawData = '';
        // var newBuffer = Buffer.concat([buffer1, buffer2]);
        res.on('data', (chunk) => {
            rawData += chunk;
        });
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
