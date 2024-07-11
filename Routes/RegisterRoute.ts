import {  Router } from "express";
import {RegisterUser,Login,refreshToken} from "../Controllers/UserController"
import { getAllUrlOfUsers, urlShortner } from "../Controllers/ShortUrlController";
import verifyJWT from "../Middleware/auth";
const router = Router()


//User Router

router.post("/user",RegisterUser)
router.get("/login",Login)
router.post("/refreshToken",refreshToken)
router.post('/urlShortner',verifyJWT,urlShortner)

router.post("/getAllUrls",verifyJWT,getAllUrlOfUsers)


export default router