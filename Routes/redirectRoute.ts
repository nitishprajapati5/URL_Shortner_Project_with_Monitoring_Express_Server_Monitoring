import {  Router } from "express";
import { redirectUrl } from "../Controllers/ShortUrlController";

const router = Router()


//User Router

router.get("/",redirectUrl)



export default router