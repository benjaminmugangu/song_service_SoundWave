"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_js_1 = require("./controller.js");
const router = express_1.default.Router();
router.get("/album/all", controller_js_1.getAllAlbum);
router.get("/song/all", controller_js_1.getAllsongs);
router.get("/album/:id", controller_js_1.getAllSongsOfAlbum);
router.get("/song/:id", controller_js_1.getSingleSong);
exports.default = router;
