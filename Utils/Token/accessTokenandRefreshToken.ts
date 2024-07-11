import jwt from 'jsonwebtoken'
import "dotenv"

console.log(process.env.ACCESS_TOKEN_SECRET)
const ACCESS_TOKEN_SECRET = "URLSHORTNER"
const REFRESH_TOKEN_SECRET = "URLSHORTNER_REFRESH"
const ACCESS_TOKEN_EXPIRY = "1d"
const REFRESH_TOKEN_EXPIRY = "15d"

export const generateAccessToken = (userId:number,username:string):string => {
    return jwt.sign({
        id:userId,
        name:username
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY as string
    }
    )

}

export const generateRefreshToken = (userId:number,username:string):string => {
    return jwt.sign({
        id:userId,
        name:username
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY as string
    })
}
