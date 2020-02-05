"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compareChar = (a, b) => {
    //TODO need fixed ascii order is not right
    return a.title === b.title ? 0 : (a.title > b.title ? 1 : -1);
};
exports.sortChars = (chars) => {
    const newChars = [...chars];
    newChars.sort(compareChar);
    return newChars;
};
