"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const zlib_1 = __importDefault(require("zlib"));
const codec_1 = require("./codec");
exports.parseUrl = (urlStr) => {
    const urlObj = url_1.default.parse(urlStr);
    const option = {
        protocol: urlObj.protocol,
        host: urlObj.host,
        hostname: urlObj.hostname,
        port: urlObj.port,
        method: 'GET',
        path: urlObj.path,
        headers: {
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
        },
        timeout: 10
    };
    console.log(option);
    return option;
};
exports.request = (options, data) => new Promise((resolve, reject) => {
    const cb = (res) => {
        const rawData = [];
        res.on('data', (chunk) => {
            rawData.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        res.on('end', () => {
            try {
                let newBuffer = Buffer.concat(rawData);
                if (res.headers['content-encoding'] === 'gzip') {
                    newBuffer = zlib_1.default.gunzipSync(newBuffer);
                }
                console.log('headers', res.headers);
                console.log('statusCode', res.statusCode);
                const tryStr = newBuffer.toString();
                const meta = tryStr.match(/<meta\shttp-equiv="Content-Type"\scontent="text\/html;\scharset=([^\"]*)"\s\/>/i);
                if (meta && meta.length > 1 && meta[1] !== 'utf-8') {
                    resolve(codec_1.decode(newBuffer, meta[1]));
                }
                else {
                    resolve(tryStr);
                }
            }
            catch (e) {
                reject(e);
            }
        });
    };
    const httpMod = options.protocol === 'https:' ? https_1.default.request : http_1.default.request;
    if (options.protocol === 'https:') {
        options.rejectUnauthorized = false;
        // pool: false,
        // strictSSL: false,
        // rejectUnauthorized: false,
    }
    const req = httpMod(options, cb);
    req.on('error', e => reject(e));
    if (data) {
        req.write(data);
    }
    req.end();
});
