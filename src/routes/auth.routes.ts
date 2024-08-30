import  express from 'express'
import {register} from "../controllers/authController"
import {login} from "../controllers/authController"
import {middlewareLogin} from "../controllers/authController";


const routes = express.Router();

 
routes.get('/register', (req, res) => {

})


routes.post('/register',register)


routes.post('/login', middlewareLogin, login)

export default routes

