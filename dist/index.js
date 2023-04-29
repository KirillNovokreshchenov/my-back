"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const videos_1 = require("./routes/videos");
const testing_1 = require("./routes/testing");
const app = (0, express_1.default)();
const port = 3000;
const bodyMiddleware = (0, body_parser_1.default)();
app.use(bodyMiddleware);
app.use('/videos', videos_1.videoRouter);
app.use('/testing', testing_1.testingRouter);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
