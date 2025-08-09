"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleSong = exports.getAllSongsOfAlbum = exports.getAllsongs = exports.getAllAlbum = void 0;
const db_js_1 = require("./config/db.js");
const TryCatch_js_1 = __importDefault(require("./TryCatch.js"));
const index_js_1 = require("./index.js");
exports.getAllAlbum = (0, TryCatch_js_1.default)(async (req, res) => {
    let albums;
    const CACHE_EXPIRY = 1800;
    if (index_js_1.redisClient.isReady) {
        albums = await index_js_1.redisClient.get("albums");
    }
    if (albums) {
        console.log("Cache hit");
        res.json(JSON.parse(albums));
        return;
    }
    else {
        console.log("Cache miss");
        albums = await (0, db_js_1.sql) `SELECT * FROM albums`;
        if (index_js_1.redisClient.isReady) {
            await index_js_1.redisClient.set("albums", JSON.stringify(albums), {
                EX: CACHE_EXPIRY,
            });
        }
        res.json(albums);
        return;
    }
});
exports.getAllsongs = (0, TryCatch_js_1.default)(async (req, res) => {
    let songs;
    const CACHE_EXPIRY = 1800;
    if (index_js_1.redisClient.isReady) {
        songs = await index_js_1.redisClient.get("songs");
    }
    if (songs) {
        console.log("Cache hit");
        res.json(JSON.parse(songs));
        return;
    }
    else {
        console.log("Cache miss");
        songs = await (0, db_js_1.sql) `SELECT * FROM songs`;
        if (index_js_1.redisClient.isReady) {
            await index_js_1.redisClient.set("songs", JSON.stringify(songs), {
                EX: CACHE_EXPIRY,
            });
        }
        res.json(songs);
        return;
    }
});
exports.getAllSongsOfAlbum = (0, TryCatch_js_1.default)(async (req, res) => {
    const { id } = req.params;
    const CACHE_EXPIRY = 1800;
    let album, songs;
    if (index_js_1.redisClient.isReady) {
        const cacheData = await index_js_1.redisClient.get(`album_songs_${id}`);
        if (cacheData) {
            console.log("cache hit");
            res.json(JSON.parse(cacheData));
            return;
        }
    }
    album = await (0, db_js_1.sql) `SELECT * FROM albums WHERE id = ${id}`;
    if (album.length === 0) {
        res.status(404).json({
            message: "No album with this id",
        });
        return;
    }
    songs = await (0, db_js_1.sql) ` SELECT * FROM songs WHERE album_id = ${id}`;
    const response = { songs, album: album[0] };
    if (index_js_1.redisClient.isReady) {
        await index_js_1.redisClient.set(`album_songs_${id}`, JSON.stringify(response), {
            EX: CACHE_EXPIRY,
        });
    }
    console.log("chche miss");
    res.json(response);
});
exports.getSingleSong = (0, TryCatch_js_1.default)(async (req, res) => {
    const song = await (0, db_js_1.sql) `SELECT * FROM songs WHERE id = ${req.params.id}`;
    res.json(song[0]);
});
