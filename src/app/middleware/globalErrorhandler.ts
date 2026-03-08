import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma";
import { TypeErrorSource, TypeErrorResponse } from "../interfaces/error.interfaces";
import handleZodError from "../errorHelpers/handlezoderror";



export const globalErrorhandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (envVars.NODE_ENV === "development") {
        console.log(err);
    }

    let errorSources: TypeErrorSource[] = [];
    let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
    let message: string = "Internal Server Error";

    // Zod Error
    if (err instanceof ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = StatusCodes.NOT_FOUND;
            message = "Record not found";
        } else if (err.code === "P2002") {
            statusCode = StatusCodes.CONFLICT;
            message = "Unique constraint violation";
        }
    }

    // if no errorSources added
    if (errorSources.length === 0) {
        errorSources.push({
            path: "",
            message: err.message,
        });
    }

    const errorResponse: TypeErrorResponse = {
        statusCode,
        message,
        errorSources,
    };

    res.status(statusCode).json(errorResponse);
};