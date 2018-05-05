"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
console.log('hi123asdasd');
const x = http_1.default.get('http://www.baidu.com', res => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            // const parsedData = JSON.parse(rawData);
            console.log(rawData);
        }
        catch (e) {
            console.error(e.message);
        }
    });
});
