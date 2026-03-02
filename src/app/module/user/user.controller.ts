import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserService } from "./user.service";
import { Request, Response } from "express";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createDoctor(req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor created successfully",
        data: result
    });
})

export const UserController = {
    createDoctor
}