import { Response } from "express";
import { Request } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction } from "express";

import { passwordEncrypt } from "../utilities/passwordEncrypt";
import {comparePasswordHash} from "../utilities/passwordEncrypt";
import prisma from "../models/user/user.model";
import generateToken from "../utilities/authJWT";


//Configurando las variables de entorno.
dotenv.config({ path: __dirname+'/.env' });

//Asignando la secret del token en una variable para posterior uso en el middleware.
const tokenUser = process.env.TOKEN_SECRET || 'default-secret';



export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ message: 'Email y contraseña son requeridos.' });
      return;
    }
      //Validamos si ya existe un usuario resistrado con el correo enviado en la oetición.
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      })
    
      if (user) {
        res.status(400).json({ message: 'El email que está intentando registrar ya le pertenece a un usuario.' });
        return
      }

      //Encriptamos la contraseña que el usuario envía para el registro de su cuenta.
      const contraseniaEncriptada = await passwordEncrypt(password);


      //Creando un insert a la BD desde el método create de prisma ORM.
      const dataUser = await prisma.user.create({
        data: {
          email, //Omitimos el email: email al tratarse de ecmascript6.
          password: contraseniaEncriptada,
        },
      });

      const tokenUser = await generateToken(dataUser);
      res.status(201).json({ tokenUser });

      //Envíar información a la base de datos. 

} catch (error:any) {
    if (error?.code =='P2002' && error.meta.target.includes('email')){
      res.status(400).json({ message: 'El email que está intentando registrar ya le pertenece a un usuario.' });

    }

    console.log(error);
    res
      .status(500)
      .json({
        error: "Hubo un error en el servidor al procesar tu solicitud.",
      });
  }
};


export const login =  async (req: Request, res: Response): Promise<void> => {
 //Desestructurando información del body de la petición para loguearse con credenciales de un usuario.
 const { email, password } = req.body;

 try {
  //  const user = await prisma.user.findUnique({
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!user) {
    res.status(404).json({ message: 'El usuario y la contraseña no coinciden.' });
    return
  }

    
    const resultPasswordCompare = comparePasswordHash( password,user.password)
    if (!resultPasswordCompare) {
      res.status(401).json({ message: 'El usuario y la contraseña no coinciden.' });
      return
    }

      const tokenUser = await generateToken(user);
      res.status(201).json({ tokenUser });

 } catch (error) {
  res.status(500).json({ error: 'Error interno del servidor al intentar procesar la petición' });

 }
}





//Middleware para usar en el login y validar el acceso de un usuario a rutas.
export const middlewareLogin = (req: Request, res: Response, next: NextFunction) => {
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
  jwt.verify(token, tokenUser, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para acceder a este recurso." });
    } else {
        console.log("Usuario logueado correctamente")
      next();
    }
  });
};