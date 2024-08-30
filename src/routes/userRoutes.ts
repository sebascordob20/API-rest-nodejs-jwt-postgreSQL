import { getAllUsers } from "../controllers/userController";
import { getUser } from "../controllers/userController";
import {updateUser} from "../controllers/userController";
import {deleteUser}  from "../controllers/userController";
import {updateUserPatch} from "../controllers/userController";
import  express from 'express'
import {middlewareLogin} from "../controllers/authController";


const userRoutes = express.Router();


userRoutes.get('/',middlewareLogin, getAllUsers);

userRoutes.get("/:id",middlewareLogin,getUser);

userRoutes.post("/", middlewareLogin, () => {});

userRoutes.put("/:id", middlewareLogin, updateUser);

userRoutes.patch("/:id",middlewareLogin, updateUserPatch);

userRoutes.delete("/:id",middlewareLogin, deleteUser);


export default userRoutes
