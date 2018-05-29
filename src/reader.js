"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = __importDefault(require("./file"));
const book_1 = __importDefault(require("./book"));
const readBooks = (dirs) => {
    return dirs.map(readBook);
};
const readBook = (dir) => {
    const book = file_1.default.readJsonFile(dir + '/book.json');
    book.location = dir;
    return new book_1.default(book);
};
const init = () => {
    return {
        "sites": file_1.default.readJsonDir('data/sites'),
        "books": readBooks(file_1.default.readSubDirs('data/books'))
    };
};
const storge = init();
console.log(storge);
class ReaderImpl {
    all() {
        return storge.books;
    }
    list(param) {
        return storge.books;
    }
    get(id) {
        return storge.books[0];
    }
    update(book) {
        if (typeof book === 'string') {
            book = this.get(book);
        }
        book.update();
        return '123';
    }
    add(book) {
        throw new Error("Method not implemented.");
    }
    del(book) {
        throw new Error("Method not implemented.");
    }
    updateAll() {
        storge.books.map(this.update);
        return '123';
    }
}
exports.default = ReaderImpl;
