"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDB = exports.collectionPosts = exports.collectionBlogs = void 0;
const mongodb_1 = require("mongodb");
const uri = process.env.mongoURI || 'mongodb://127.0.0.1:27017';
const client = new mongodb_1.MongoClient(uri);
const db = client.db('project');
exports.collectionBlogs = db.collection('blog');
exports.collectionPosts = db.collection('post');
function runDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.db("project").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        }
        finally {
            //await client.close();
        }
    });
}
exports.runDB = runDB;
