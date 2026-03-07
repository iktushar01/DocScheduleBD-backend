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

const getSingleDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.getSingleDoctor(id as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor retrieved successfully",
        data: result
    });
})

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.updateDoctor(id as string, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor updated successfully",
        data: result
    });
})

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await DoctorService.deleteDoctor(id as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Doctor deleted successfully",
        data: result
    });
})

export const DoctorController = {
    getAllDoctors,
    getSingleDoctor,
    updateDoctor,
    deleteDoctor
}
