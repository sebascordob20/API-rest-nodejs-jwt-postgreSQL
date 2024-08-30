import express from 'express'
import dotenv from 'dotenv';
import routes from './routes/auth.routes'
import userRoutes from './routes/userRoutes'

dotenv.config({ path: __dirname+'/.env' });


const webServer = express()

webServer.use(express.json())

webServer.use('/auth',routes)
webServer.use('/users',userRoutes)


webServer.listen(process.env.PORT, ()=>{
console.log('listening on port 3000')
})