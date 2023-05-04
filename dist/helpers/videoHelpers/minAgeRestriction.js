"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correctAge = void 0;
function correctAge(valueAge) {
    return valueAge > 18 ? false : valueAge < 1 ? false : true;
}
exports.correctAge = correctAge;
