"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoUpdate = void 0;
function videoUpdate(video, requestBody) {
    Object.keys(requestBody).forEach(prop => video[prop] = requestBody[prop]);
}
exports.videoUpdate = videoUpdate;
