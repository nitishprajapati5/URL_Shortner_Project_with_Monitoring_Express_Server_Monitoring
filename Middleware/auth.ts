import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../Utils/ApiHandler/ApiResponse';
import jwt from 'jsonwebtoken'
import prisma from '../dbConfig/dbConfig';
import { DecodeToken } from '../Interfaces/decodedToken';
import { configDotenv } from 'dotenv';


const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationToken = req.headers.authorization?.replace("Bearer ", "");

        if (!authorizationToken) {
            return res.status(401).json({ error: "Unauthorized Token" });
        }


        console.log("Authorization Token",authorizationToken);
        const decodedToken = <DecodeToken>jwt.verify(authorizationToken,process.env.ACCESS_TOKEN_SECRET as string);

        const user = await prisma.user.findFirst({
            where:{
                id:decodedToken.id
            },
            select:{
                userName:true,
                id:true
            }
            
        })

        console.log("User Data ",user);


        if(!user){
            return res.status(400).json({error : "Invalid User!!"})
        }

        console.log(user);

        const userData = {
            id:user.id,
            username:user.userName
        }

        req.id = userData.id;
        req.username = userData.username;


        next();
    } catch (error) {
        console.error("Error in logger middleware:", error);
        res.status(500).json({ error: "UnAuthorized Token" });
    }
};

export default verifyJWT;
