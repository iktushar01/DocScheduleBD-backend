import { success } from "better-auth";
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import { StatusCodes } from "http-status-codes";
export const globalErrorhandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(envVars.NODE_ENV === "development") {
        console.log(err);
    }
    const statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
    const message : string = "Internal Server Error";
    const error : string = err.message;
    res.status(statusCode).json(
        { 
            success: false,
            message: message,
            error: error
     });
}