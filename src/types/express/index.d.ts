import * as express from "express"


declare global {
  namespace Express {
    export interface Request {
        id? : number,
        username? : string
      // extra variables you want to use in req object
    }
  }

}