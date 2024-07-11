import express, { json, urlencoded,Request,Response } from 'express'
import cors from 'cors'
const port = process.env.PORT || 3000;
const app = express()
require('dotenv').config()


app.use(cors())
app.use(express.json())
app.use(urlencoded({extended:false}))
app.use(require('express-status-monitor')());


//MiddleWare

import RegisterRoute from './Routes/RegisterRoute'
import redirectRoute from './Routes/redirectRoute'
app.use('/api',RegisterRoute)
app.use('/x',redirectRoute);



app.use("/",(req:Request,res:Response) => {
    return res.json({
        msg : "Hey Server is up and Running!!!"
    })
})


  
app.listen(port,() => {
    console.log("Server Running on the Port ",port);
})