import { NextFunction, Request, Response } from "express";
import { CustomError } from "../helper/CustomError";


export const errorMiddleware = ( err:CustomError,req:Request, res:Response, next:NextFunction) =>{
    const errText = err?.text
  res.status(err.statusCode || 500).json({
  ok: false,
  message: errText || err.message || "Something went wrong",
  status: err.statusCode || 500
});
}