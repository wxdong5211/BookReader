"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateDirResult {
    constructor(chars, num) {
        this.chars = chars;
        this.num = num;
    }
}
exports.UpdateDirResult = UpdateDirResult;
class UpdateCharResult {
    constructor(total, skip, done, error) {
        this.total = total;
        this.skip = skip;
        this.done = done;
        this.error = error;
    }
}
exports.UpdateCharResult = UpdateCharResult;
var CharcterState;
(function (CharcterState) {
    CharcterState[CharcterState["Init"] = 0] = "Init";
    CharcterState[CharcterState["Done"] = 1] = "Done";
    CharcterState[CharcterState["Error"] = 2] = "Error";
})(CharcterState = exports.CharcterState || (exports.CharcterState = {}));
