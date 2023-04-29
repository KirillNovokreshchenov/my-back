"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicationDate = void 0;
function publicationDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString();
}
exports.publicationDate = publicationDate;
