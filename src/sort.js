"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const unitDict = { '十': 1, '百': 2, '千': 3, '万': 4, '亿': 8 };
const str2num = (chars) => {
    let c = null;
    const len = chars.length;
    const nums = chars.map(c => numArr.indexOf(c));
    for (let i = 0; i < len; i++) {
        c = chars[i];
        const unitIdx = unitDict[c];
        if (unitIdx != null) {
            const unitNum = Math.pow(10, unitIdx);
            if (i === 0) {
                nums[0] = unitNum;
            }
            else {
                nums[i - 1] *= unitNum;
            }
        }
    }
    return nums.filter(n => n !== -1).reduce((p, c) => p + c, 0);
};
const compareChar = (a, b) => {
    const aNum = exports.title2num(a.title);
    const bNum = exports.title2num(b.title);
    return aNum === bNum ? 0 : (aNum > bNum ? 1 : -1);
};
exports.title2num = (t) => {
    const chars = t.split('');
    const nums = [];
    let oneNum = [];
    let c = null;
    for (let i in chars) {
        c = chars[i];
        if (numArr.indexOf(c) !== -1 || unitDict[c] != null) {
            oneNum.push(c);
        }
        else {
            if (oneNum.length > 0) {
                nums.push(oneNum);
                oneNum = [];
            }
        }
    }
    return nums.map(str2num)[0];
};
exports.sortChars = (chars) => {
    const newChars = [...chars];
    newChars.sort(compareChar);
    return newChars;
};
