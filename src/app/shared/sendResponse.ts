import { Response } from "express";

interface ISendResponse<T> {
    statusCode: number;
    success: boolean;
    data?: T;
    message?: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const sendResponse = <T>(res: Response, data: ISendResponse<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data,
    });
}
