"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findResolutions = void 0;
const allowedResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
function findResolutions(resolutions) {
    const filterResolutions = resolutions.filter(el => allowedResolutions.includes(el));
    if (filterResolutions.length === resolutions.length) {
        return true;
    }
    else
        return false;
}
exports.findResolutions = findResolutions;
