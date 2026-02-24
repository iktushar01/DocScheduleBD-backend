import { Response } from "express";

interface ISentResponse<T> {
    statusCode: number;
    success: boolean;
    data?: T;
    message?: string;
}

export const sentResponse = <T>(res: Response, data: ISentResponse<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        data: data.data,
        message: data.message,
    });
}