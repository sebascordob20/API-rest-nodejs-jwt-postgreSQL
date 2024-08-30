"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authController_2 = require("../controllers/authController");
const authController_3 = require("../controllers/authController");
const routes = express_1.default.Router();
routes.get('/register', (req, res) => {
});
routes.post('/register', authController_1.register);
routes.post('/login', authController_3.middlewareLogin, authController_2.login);
exports.default = routes;
