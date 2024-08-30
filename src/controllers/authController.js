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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareLogin = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const passwordEncrypt_1 = require("../utilities/passwordEncrypt");
const passwordEncrypt_2 = require("../utilities/passwordEncrypt");
const user_model_1 = __importDefault(require("../models/user/user.model"));
const authJWT_1 = __importDefault(require("../utilities/authJWT"));
//Configurando las variables de entorno.
dotenv_1.default.config({ path: __dirname + '/.env' });
//Asignando la secret del token en una variable para posterior uso en el middleware.
const tokenUser = process.env.TOKEN_SECRET || 'default-secret';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ message: 'Email y contraseña son requeridos.' });
            return;
        }
        //Validamos si ya existe un usuario resistrado con el correo enviado en la oetición.
        const user = yield user_model_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (user) {
            res.status(400).json({ message: 'El email que está intentando registrar ya le pertenece a un usuario.' });
            return;
        }
        //Encriptamos la contraseña que el usuario envía para el registro de su cuenta.
        const contraseniaEncriptada = yield (0, passwordEncrypt_1.passwordEncrypt)(password);
        //Creando un insert a la BD desde el método create de prisma ORM.
        const dataUser = yield user_model_1.default.user.create({
            data: {
                email, //Omitimos el email: email al tratarse de ecmascript6.
                password: contraseniaEncriptada,
            },
        });
        const tokenUser = yield (0, authJWT_1.default)(dataUser);
        res.status(201).json({ tokenUser });
        //Envíar información a la base de datos. 
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) == 'P2002' && error.meta.target.includes('email')) {
            res.status(400).json({ message: 'El email que está intentando registrar ya le pertenece a un usuario.' });
        }
        console.log(error);
        res
            .status(500)
            .json({
            error: "Hubo un error en el servidor al procesar tu solicitud.",
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Desestructurando información del body de la petición para loguearse con credenciales de un usuario.
    const { email, password } = req.body;
    try {
        //  const user = await prisma.user.findUnique({
        const user = yield user_model_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            res.status(404).json({ message: 'El usuario y la contraseña no coinciden.' });
            return;
        }
        const resultPasswordCompare = (0, passwordEncrypt_2.comparePasswordHash)(password, user.password);
        if (!resultPasswordCompare) {
            res.status(401).json({ message: 'El usuario y la contraseña no coinciden.' });
            return;
        }
        const tokenUser = yield (0, authJWT_1.default)(user);
        res.status(201).json({ tokenUser });
    }
    catch (error) {
        res.status(500).json({ error: 'Error interno del servidor al intentar procesar la petición' });
    }
});
exports.login = login;
//Middleware para usar en el login y validar el acceso de un usuario a rutas.
const middlewareLogin = (req, res, next) => {
    //extrayendo el http header de autorizacion.
    const authHeader = req.headers["authorization"];
    //
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ message: "Acceso no autorizado al recurso web" });
    }
    //De lo contrario, validamos el token enviado con el jwt secret de nuestra aplicación.
    jsonwebtoken_1.default.verify(token, tokenUser, (err, decoded) => {
        if (err) {
            return res
                .status(403)
                .json({ message: "No tienes permiso para acceder a este recurso." });
        }
        else {
            console.log("Usuario logueado correctamente");
            next();
        }
    });
};
exports.middlewareLogin = middlewareLogin;
