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
        timeout: 10000
    };
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
                const tryStr = newBuffer.toString();
                const meta = tryStr.match(/<meta\shttp-equiv="content-type"\scontent="text\/html;\s*charset=([^\"]*)"\s*\/?>/i);
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
    req.on('timeout', function () {
        // if(req.res){
        //     req.res('abort');
        // }
        req.abort();
    });
    req.on('error', e => reject(e));
    if (data) {
        req.write(data);
    }
    req.end();
});
exports.readHtml = async (url) => {
    const option = exports.parseUrl(url);
    option.headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
    };
    const req = await exports.request(option);
    return req;
};
