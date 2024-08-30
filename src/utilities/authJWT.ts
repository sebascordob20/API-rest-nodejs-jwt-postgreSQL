import jwt from "jsonwebtoken";
import User from "../models/user/user.interface";

import * as dotenv from "dotenv";

dotenv.config();

const jsonwebtoken = process.env.Json_WEB_TOKEN__SECRET  || 'jwt-secret-defult';

//Función que genera el token para la sesión el usuario.
const generateToken = (user: User): string => {
  var token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    jsonwebtoken,
    { expiresIn: "1h" }
  );

  return token;
};

export default generateToken;
