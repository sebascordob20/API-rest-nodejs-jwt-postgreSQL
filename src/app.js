"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config({ path: __dirname + '/.env' });
const webServer = (0, express_1.default)();
webServer.use(express_1.default.json());
webServer.use('/auth', auth_routes_1.default);
webServer.use('/users', userRoutes_1.default);
webServer.listen(process.env.PORT, () => {
    console.log('listening on port 3000');
});
