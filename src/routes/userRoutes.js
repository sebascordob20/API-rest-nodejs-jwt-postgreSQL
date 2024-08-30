"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const userController_2 = require("../controllers/userController");
const userController_3 = require("../controllers/userController");
const userController_4 = require("../controllers/userController");
const userController_5 = require("../controllers/userController");
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userRoutes = express_1.default.Router();
userRoutes.get('/', authController_1.middlewareLogin, userController_1.getAllUsers);
userRoutes.get("/:id", authController_1.middlewareLogin, userController_2.getUser);
userRoutes.post("/", authController_1.middlewareLogin, () => { });
userRoutes.put("/:id", authController_1.middlewareLogin, userController_3.updateUser);
userRoutes.patch("/:id", authController_1.middlewareLogin, userController_5.updateUserPatch);
userRoutes.delete("/:id", authController_1.middlewareLogin, userController_4.deleteUser);
exports.default = userRoutes;
