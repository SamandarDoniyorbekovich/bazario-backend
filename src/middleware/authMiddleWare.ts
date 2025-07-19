import { NextFunction, Request, Response } from "express";
import { CustomError } from "../helper/CustomError";
import { chekToekn } from "../helper/jwt";
// const JWT_SECRET = process.env.JWT_SECRET

export const authMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers?.authorization || ""
        if (!token) {
            throw new CustomError("token not fount", 401)
        }

        const decodedToken = chekToekn(token.split(' ')?.[1])
        if (!decodedToken) {
            throw new CustomError("token is invalid", 401)
        }

        // @ts-ignore
        req.userId = decodedToken?.userId
        next()
    } catch (error) {
        console.log(error);
        next(error)
    }
}