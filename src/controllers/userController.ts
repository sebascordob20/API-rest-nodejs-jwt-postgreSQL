import { Response } from "express";
import { Request } from "express";
import { passwordEncrypt } from "../utilities/passwordEncrypt";
import prisma from "../models/user/user.model";
import {validateCharacter} from "../utilities/validateData";
import {validateNumber} from "../utilities/validateData";


export const getAllUsers = async (req: Request, res: Response) : Promise<void> => {
  const usuarios = await prisma.user.findMany()
  res.status(200).json({ users: usuarios});   
} ;
 

export const getUser = async (req: Request, res: Response): Promise<void> => {
  let idUser = req.params.id;

  if(validateCharacter(idUser)){
    res.status(400).json({ message: "Debe enviar un número en el parametro ID." });
  return
  }

  //Definiendo variable que servirá como id para buscar en la base de datos por medio de prisma.
  let identificador = parseInt(idUser);

  if (validateNumber(identificador)){
    const getUser = await prisma.user.findUnique({
      where: {
        id: identificador,
      },
    });

    if (getUser){
      res.status(200).json({ getUser });
      return;

    } else {
      res.status(404).json({ message: "El usuario solicitado no existe." });
      return;
    }

  }else{
    res.status(400).json({ message: "debe enviar un número en el parametro ID."});
    return
  }
};





export const updateUser = async (req: Request, res: Response) : Promise<void> => {
try {
      const idUser = req.params.id;
      const {email, password} = req.body;

    
      if (!email || !password) {
        res.status(400).json({ message: "Email y contraseña son requeridos." });
        return;
      }


      if(validateCharacter(idUser)){
        res.status(400).json({ message: "Debe enviar un número en el parametro ID." });
        return
      }

      let identificador = parseInt(idUser);

      if (validateNumber(identificador)){
        let dataActualizar: any = { ...req.body };
        if (email) {
          dataActualizar.email = email;
        }

        if (password) {
          let contrasenaHasheada = await passwordEncrypt(password);
          dataActualizar.password = contrasenaHasheada;
        }

        const updateData = await prisma.user.updateMany({
          where: {
            id: identificador,
          },
          data: dataActualizar,
        });

        res.status(200).json({ updateData });
        return;
      }else{
        res.status(400).json({ message: `debe enviar un número en el parametro ID.`});
        return
      }
      
    } catch (error: any) {
      if (error?.code == "P2002" && error.meta.target.includes("email")) {
        res
          .status(400)
          .json({
            message:
              "El email que está intentando registrar ya le pertenece a un usuario.",
          });
      }
      console.log(error);
      res.status(500).json({
        error: "Hubo un error en el servidor al procesar tu solicitud.",
      });
    } 
};


export const updateUserPatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idUser = req.params.id;
    const { email, password } = req.body;

    if(validateCharacter(idUser)){
      res.status(400).json({ message: "Debe enviar un número en el parametro ID." });
      return
    }

    let identificador = parseInt(idUser);

    if (validateNumber(identificador)){
      let dataActualizar: any = { ...req.body };
      if (email) {
        dataActualizar.email = email;
      }

      if (password) {
        let contrasenaHasheada = await passwordEncrypt(password);
        dataActualizar.password = contrasenaHasheada;
      }

      const updateData = await prisma.user.updateMany({
        where: {
          id: identificador,
        },
        data: dataActualizar,
      });

      res.status(200).json({ updateData });
      return;
    }else{
      res.status(400).json({ message: `debe enviar un número en el parametro ID.`});
      return
    }
    

  } catch (error: any) {
    if (error?.code == "P2002" && error.meta.target.includes("email")) {
      res.status(400).json({
        message:
          "El email que está intentando registrar ya le pertenece a un usuario.",
      });
    }
    console.log(error);
    res.status(500).json({
      error: "Hubo un error en el servidor al procesar tu solicitud.",
    });
  }
  return;
};




export const deleteUser = async (req: Request, res: Response) : Promise<void> => {
  try {
   const idUser = req.params.id;

   if(validateCharacter(idUser)){
     res.status(400).json({ message: "Debe enviar un número en el parametro ID." });
   return
   }

   let identificador = parseInt(idUser);

   if(validateNumber(identificador)){
   const getUser = await prisma.user.findUnique({
       where: {
         id: identificador,
       },
     });

//Validar que el usuario existe con el ide enviado como parametro.
if (!getUser){
   res.status(404).json({ message: `El usuario con id ${idUser} no existe.`});
   return
   //throw new Error('Es obligatorio ingresar un email para poder registrarse en la plataforma.')
 }else{
  await prisma.user.deleteMany({
       where: {
         id: identificador
       }
     })
     res.status(200).json({ message: `Se borró correctamente el usuario con ID: ${idUser}`}).end()
     ;
     return
 }

   }else{
       res.status(400).json({ message: `Debe enviar un número en el parametro ID.`});
       return
   }
  
   
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

