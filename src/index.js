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
var CharcterState;
(function (CharcterState) {
    CharcterState[CharcterState["Init"] = 0] = "Init";
    CharcterState[CharcterState["Done"] = 1] = "Done";
    CharcterState[CharcterState["Error"] = 2] = "Error";
})(CharcterState || (CharcterState = {}));
const sleep = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));
const readDir = (book) => __awaiter(this, void 0, void 0, function* () {
    const option = request_1.default.parseUrl(book.url);
    let req = yield request_1.default.request(option);
    const start = book.block.dirStart;
    const end = book.block.dirEnd;
    req = req.substr(req.indexOf(start) + start.length);
    req = req.substr(0, req.indexOf(end));
    const dirHtml = req.match(/<a.*href=".*".*>.*<\/a>/gi);
    if (dirHtml) {
        const hrefStart = 'href="';
        let idx = 0;
        return dirHtml.map(x => {
            let href = x.substr(x.indexOf(hrefStart) + hrefStart.length);
            href = href.substr(0, href.indexOf('"'));
            const title = x.replace(/<\/?[^>]*>/g, '');
            const charcter = {
                url: href,
                title: title,
                create: new Date(),
                disOrder: idx,
                order: idx,
                state: CharcterState.Init
            };
            idx++;
            return charcter;
        });
    }
    return [];
});
const updateDir = (book) => __awaiter(this, void 0, void 0, function* () {
    try {
        const chars = yield readDir(book);
        console.log(chars);
        for (let x in chars) {
            yield sleep(1000);
            console.log(new Date());
            console.log(chars[x]);
        }
    }
    catch (e) {
        console.log('problem with request: ' + e.message);
    }
});
const writeBook = (book) => {
    file_1.default.writeFile('data/test.json', JSON.stringify(book, null, 2));
};
const init = () => {
    return {
        "sites": file_1.default.readJsonDir('data/sites'),
        "books": file_1.default.readJsonDir('data/books')
    };
};
const test = () => {
    const book = init();
    console.log(book);
    // updateDir(book.books[0]);
    writeBook(book.books[0]);
};
test();
