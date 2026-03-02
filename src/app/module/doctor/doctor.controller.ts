import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import { Request, Response } from "express";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorService.getAllDoctors();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctors retrieved successfully",
        data: result
    });
})

export const DoctorController = {
    getAllDoctors
}
