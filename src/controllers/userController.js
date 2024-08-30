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
exports.deleteUser = exports.updateUserPatch = exports.updateUser = exports.getUser = exports.getAllUsers = void 0;
const passwordEncrypt_1 = require("../utilities/passwordEncrypt");
const user_model_1 = __importDefault(require("../models/user/user.model"));
const validateData_1 = require("../utilities/validateData");
const validateData_2 = require("../utilities/validateData");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarios = yield user_model_1.default.user.findMany();
    res.status(200).json({ users: usuarios });
});
exports.getAllUsers = getAllUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let idUser = req.params.id;
    if ((0, validateData_1.validateCharacter)(idUser)) {
        res.status(400).json({ message: "Debe enviar un número en el parametro ID." });
        return;
    }
    //Definiendo variable que servirá como id para buscar en la base de datos por medio de prisma.
    let identificador = parseInt(idUser);
    if ((0, validateData_2.validateNumber)(identificador)) {
        const getUser = yield user_model_1.default.user.findUnique({
            where: {
                id: identificador,
            },
        });
        if (getUser) {
            res.status(200).json({ getUser });
            return;
        }
        else {
            res.status(404).json({ message: "El usuario solicitado no existe." });
            return;
        }
    }
    else {
        res.status(400).json({ message: "debe enviar un número en el parametro ID." });
        return;
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.params.id;
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email y contraseña son requeridos." });
            return;
        }
        if ((0, validateData_1.validateCharacter)(idUser)) {
            res.status(400).json({ message: "Debe enviar un número en el parametro ID." });
            return;
        }
        let identificador = parseInt(idUser);
        if ((0, validateData_2.validateNumber)(identificador)) {
            let dataActualizar = Object.assign({}, req.body);
            if (email) {
                dataActualizar.email = email;
            }
            if (password) {
                let contrasenaHasheada = yield (0, passwordEncrypt_1.passwordEncrypt)(password);
                dataActualizar.password = contrasenaHasheada;
            }
            const updateData = yield user_model_1.default.user.updateMany({
                where: {
                    id: identificador,
                },
                data: dataActualizar,
            });
            res.status(200).json({ updateData });
            return;
        }
        else {
            res.status(400).json({ message: `debe enviar un número en el parametro ID.` });
            return;
        }
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) == "P2002" && error.meta.target.includes("email")) {
            res
                .status(400)
                .json({
                message: "El email que está intentando registrar ya le pertenece a un usuario.",
            });
        }
        console.log(error);
        res.status(500).json({
            error: "Hubo un error en el servidor al procesar tu solicitud.",
        });
    }
});
exports.updateUser = updateUser;
const updateUserPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.params.id;
        const { email, password } = req.body;
        if ((0, validateData_1.validateCharacter)(idUser)) {
            res.status(400).json({ message: "Debe enviar un número en el parametro ID." });
            return;
        }
        let identificador = parseInt(idUser);
        if ((0, validateData_2.validateNumber)(identificador)) {
            let dataActualizar = Object.assign({}, req.body);
            if (email) {
                dataActualizar.email = email;
            }
            if (password) {
                let contrasenaHasheada = yield (0, passwordEncrypt_1.passwordEncrypt)(password);
                dataActualizar.password = contrasenaHasheada;
            }
            const updateData = yield user_model_1.default.user.updateMany({
                where: {
                    id: identificador,
                },
                data: dataActualizar,
            });
            res.status(200).json({ updateData });
            return;
        }
        else {
            res.status(400).json({ message: `debe enviar un número en el parametro ID.` });
            return;
        }
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) == "P2002" && error.meta.target.includes("email")) {
            res.status(400).json({
                message: "El email que está intentando registrar ya le pertenece a un usuario.",
            });
        }
        console.log(error);
        res.status(500).json({
            error: "Hubo un error en el servidor al procesar tu solicitud.",
        });
    }
    return;
});
exports.updateUserPatch = updateUserPatch;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.params.id;
        if ((0, validateData_1.validateCharacter)(idUser)) {
            res.status(400).json({ message: "Debe enviar un número en el parametro ID." });
            return;
        }
        let identificador = parseInt(idUser);
        if ((0, validateData_2.validateNumber)(identificador)) {
            const getUser = yield user_model_1.default.user.findUnique({
                where: {
                    id: identificador,
                },
            });
            //Validar que el usuario existe con el ide enviado como parametro.
            if (!getUser) {
                res.status(404).json({ message: `El usuario con id ${idUser} no existe.` });
                return;
                //throw new Error('Es obligatorio ingresar un email para poder registrarse en la plataforma.')
            }
            else {
                yield user_model_1.default.user.deleteMany({
                    where: {
                        id: identificador
                    }
                });
                res.status(200).json({ message: `Se borró correctamente el usuario con ID: ${idUser}` }).end();
                return;
            }
        }
        else {
            res.status(400).json({ message: `Debe enviar un número en el parametro ID.` });
            return;
        }
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
exports.deleteUser = deleteUser;
