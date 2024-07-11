import { RequestHandler,Response,Request } from "express";
// import prisma from "../dbConfig/dbConfig";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log : ['query','error','info','warn']
})



function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }    
    return result;
}

async function isUniqueValue(value:string):Promise<boolean> {
    const user = await prisma.tinyUrl.findUnique({
        where:{
            shortCode:value
        },
    })

    return user === null;
}


async function generateUniqueRandomString(length: number): Promise<string> {
    let uniqueString: string;
    let isUnique: boolean = false;

    do {
        uniqueString = generateRandomString(length);
        isUnique = await isUniqueValue(uniqueString);
    } while (!isUnique);

    return uniqueString;
}

export const urlShortner:RequestHandler = async(req:Request,res:Response) => {
    try {

        console.log(req.body)

        const longUrl:string = req.body.longUrl
        const expiresAt:Date = new Date(req.body.expiresAt)

        console.log("Expiring the Date is",expiresAt);

        console.log(typeof(expiresAt))

        //Check if Generate Random is present in DB aur not
        const generateRandomString:string = (await generateUniqueRandomString(8)).toString()

        //Adding Against LongUrl
        const shortUrl:string = "http://localhost:3000/x/" + generateRandomString;
        const userData = await prisma.tinyUrl.create({
            data:{
                user_id : req.id as number,
                longUrl:longUrl,
                shortCode:generateRandomString,
                expires:expiresAt.toISOString(),
                shortUrl:shortUrl

            },
            select:{
                user_id:true,
                longUrl:true,
                shortCode:true,
                shortUrl:true,
                expires:true
            }
        })

        return res.status(200).json({
            data:userData,
            message : "Data Created Successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            error:error,
            message:"Something went wrong!!"
        })
    }
}

export const redirectUrl:RequestHandler = async(req:Request,res:Response) => {
    try {
        // const url = new URL(req);
        // console.log("Req is ShortURl",req.body.s)
        // const shortCode = url.pathname;

        const shortCode = req.query["code"] as string;

        const userDate = await prisma.tinyUrl.findFirst({
            where:{
            AND:{
                isDisabled:false,
                shortCode :shortCode
            }
            },
            select:{
                longUrl:true
            }
        })

        //No of Hits into the System
        await prisma.tinyUrl.update({
            where: { shortCode: shortCode },
            data: { totalClicked: { increment: 1 } }
        })

        if(!userDate){
            return res.status(404).send("Error 404 Could not find the URL of Requested")
        }

        return res.status(302).redirect(userDate.longUrl);


        
    } catch (error) {
        console.log(error);
        return res.status(404).send("Error 404 Could not find the URL of Requested")
    }
}

export const getAllUrlOfUsers:RequestHandler = async(req:Request,res:Response) => {
    try{
        const userData = await prisma.tinyUrl.findMany({
            where:{
                user_id:req.id as number
            }
        })

        if(!userData){
            return res.status(200).json({
                message : "Something Went Wrong!!"
            })
        }

        return res.status(200).json({
            data:userData,
            count:userData.length,
            message:"Details fetched Successfully!!"
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            error:error,
            message:"Something went wrong!!"
        })
    }
}