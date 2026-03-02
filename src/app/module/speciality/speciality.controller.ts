import { catchAsync } from "../../shared/catchAsync";
import { SpecialityService } from "./speciality.service";
import { sendResponse } from "../../shared/sendResponse";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


const createSpeciality = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const speciality = await SpecialityService.createSpeciality(payload);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        data: speciality,
        message: "Speciality created successfully",
    });
})

const getAllSpecialities = catchAsync(async (req: Request, res: Response) => {
    const specialities = await SpecialityService.getAllSpecialities();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        data: specialities,
        message: "Specialities fetched successfully",
    });
})

const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const speciality = await SpecialityService.deleteSpeciality(id as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        data: speciality,
        message: "Speciality deleted successfully",
    });
})


const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const speciality = await SpecialityService.updateSpeciality(id as string, payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        data: speciality,
        message: "Speciality updated successfully",
    });
})

export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality
}
