import { RequestHandler,Response,Request, json } from "express";
// import prisma from "../dbConfig/dbConfig";
import { PrismaClient } from "@prisma/client";
import { generateAccessToken, generateRefreshToken } from "../Utils/Token/accessTokenandRefreshToken";
import jwt, { JwtPayload } from "jsonwebtoken"
import { ApiError } from "../Utils/ApiHandler/ApiError";
import { ApiResponse } from "../Utils/ApiHandler/ApiResponse";
import {GetStatusMessage} from "../Utils/Constants/Constants"
import {DecodeToken} from '../Interfaces/decodedToken'

const prisma = new PrismaClient({
    log : ['query']
})

 

const REFRESH_TOKEN_SECRET = "URLSHORTNER_REFRESH"


export const generateAccessTokenandRefreshToken = async (userId: number, username: string): Promise<{ accessToken: string, refreshToken: string }> => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                AND: {
                    userName: username,
                    id: userId
                }
            }
        });

        if (!user) {
            throw new Error();
        }

        const accessToken = generateAccessToken(userId, username);
        const refreshToken = generateRefreshToken(userId, username);

        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error)
        throw new Error();
    }
};

export const RegisterUser:RequestHandler = async (req:Request,res:Response) => {
    try {
        
        const {userName,FirstName,LastName,Password} = req.body;

    const checkUniqueUsername = await prisma.user.findFirst({
        where:{
            userName : userName
        }
    })

    if(checkUniqueUsername){
        return res.status(200).json({
            msg : "User Duplicate Data Found"
        })
    }

    const userData = await prisma.user.create({
        data:{
            userName:userName,
            FirstName : FirstName,
            LastName : LastName,
            Password : Password,
        }
    })

    return res.status(200).json({
        data : userData,
        msg : "User Created Successfully."
    })


    } catch (error) {
        console.log(error)
        return res.status(404).json({
            msg : "Error Occurred",
            error : error
        })
    }
}

export const Login:RequestHandler = async (req:Request,res:Response) => {
    try {
        const {userName,Password} = req.body;

        const userData = await prisma.user.findFirst({
            where:{
                userName : userName, 
                Password : Password
            }
        })

        if(!userData){
            return res.status(404).json({
                msg : "Error Occurred"
            })
        }


        const {accessToken,refreshToken} = await generateAccessTokenandRefreshToken(userData?.id as number, userData?.userName as string);

        const updateUser = await prisma.user.update({
            where: {
                userName: userName,
                Password:Password
            },
            data: {
                refreshToken:refreshToken,
                accessToken:accessToken
            },
            select:{
                refreshToken:true,
                accessToken:true,
                userName:true,
                isDisabled:true
            }
        })


        return res.status(200).json({
            data:updateUser,
            msg : "User fetched Successfully"
        })



    } catch (error) {
        console.log(error)
        return res.status(404).json({
            msg : "Error Occurred",
            error : error
        })
    }
}

export const refreshToken: RequestHandler = async(req:Request,res:Response) => {
    try {
        const incomingRefreshToken = req.body.refreshToken
        if(!incomingRefreshToken){
            return res.status(401).json({
                msg : "UnAuthorized Token"
            })
        }

        const decodedToken:DecodeToken = jwt.verify(
            incomingRefreshToken,
            REFRESH_TOKEN_SECRET
        ) as DecodeToken;


        const user = await prisma.user.findFirst({
            where : {
                id : decodedToken.id
            }
        })

        if(!user){
            return res.status(401).json({
                message : "Invalid Refresh Token"
            });
        }


        if(incomingRefreshToken !== user.refreshToken){
            return res.status(401).json({
                message : "Refresh Token Expired"
            }); 
        }

        const { accessToken,refreshToken } = await generateAccessTokenandRefreshToken(user.id,user.userName);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    accessToken : accessToken,
                    refreshToken : refreshToken
                }
            )
        )

    } catch (error) {
        console.log(error);
    }
}
