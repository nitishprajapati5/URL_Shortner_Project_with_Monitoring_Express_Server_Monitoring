import { JwtPayload } from "jsonwebtoken"

export interface DecodeToken extends JwtPayload {
    id:number
    name : string
    iat : number
    exp :  number
}

