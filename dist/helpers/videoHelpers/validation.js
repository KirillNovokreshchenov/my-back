"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const filterResolutions_1 = require("./filterResolutions");
const minAgeRestriction_1 = require("./minAgeRestriction");
function validation(video) {
    const errors = {
        "errorsMessages": []
    };
    if (video.hasOwnProperty('id') && !(typeof video.id === 'number')) {
        errors.errorsMessages.push({
            "message": "incorrect id",
            "field": "id"
        });
    }
    if ((!video.title || !(typeof video.title === 'string') || video.title.length > 40)) {
        errors.errorsMessages.push({
            "message": "incorrect title",
            "field": "title"
        });
    }
    if ((!video.author || !(typeof video.author === 'string') || video.author.length > 20)) {
        errors.errorsMessages.push({
            "message": "incorrect author",
            "field": "author"
        });
    }
    if (video.hasOwnProperty('canBeDownloaded') && (!(typeof video.canBeDownloaded === 'boolean'))) {
        errors.errorsMessages.push({
            "message": "incorrect data type",
            "field": "canBeDownloaded"
        });
    }
    if (video.hasOwnProperty('minAgeRestriction') && (!(typeof video.minAgeRestriction === 'number') || !((0, minAgeRestriction_1.correctAge)(video.minAgeRestriction)))) {
        errors.errorsMessages.push({
            "message": "incorrect age",
            "field": "minAgeRestriction"
        });
    }
    if (video.hasOwnProperty('createdAt') && (!(typeof video.createdAt === 'string'))) {
        errors.errorsMessages.push({
            "message": "incorrect date created",
            "field": "createdAt"
        });
    }
    if (video.hasOwnProperty('publicationDate') && (!(typeof video.publicationDate === 'string'))) {
        errors.errorsMessages.push({
            "message": "incorrect publication date",
            "field": "publicationDate"
        });
    }
    if (video.hasOwnProperty('availableResolutions') && (!Array.isArray(video.availableResolutions) || video.availableResolutions.length === 0 || !(0, filterResolutions_1.filterResolutions)(video.availableResolutions))) {
        errors.errorsMessages.push({
            "message": "incorrect resolutions",
            "field": "availableResolutions"
        });
    }
    return errors;
}
exports.validation = validation;
