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
const request_1 = __importDefault(require("./request"));
const file_1 = __importDefault(require("./file"));
const read = (book) => __awaiter(this, void 0, void 0, function* () {
    try {
        const option = request_1.default.parseUrl(book.url);
        let req = yield request_1.default.request(option);
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
const init = () => {
    return {
        "sites": file_1.default.readJsonDir('data/sites'),
        "books": file_1.default.readJsonDir('data/books')
    };
};
const test = () => {
    const book = init();
    console.log(book);
    // read(book.books[0]);
};
test();
