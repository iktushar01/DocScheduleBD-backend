import { catchAsync } from "../../shared/catchAsync";
import { SpecialityService } from "./speciality.service";
import { sentResponse } from "../../shared/sentResponse";
import { Request, Response } from "express";


const createSpeciality = catchAsync(async (req: Request, res: Response) => {
        const payload = req.body;
        const speciality = await SpecialityService.createSpeciality(payload);
        sentResponse(res, {
            statusCode: 201,
            success: true,
            data: speciality,
            message: "Speciality created successfully",
        });
    })

const getAllSpecialities = catchAsync(async (req: Request, res: Response) => {
        const specialities = await SpecialityService.getAllSpecialities();
        sentResponse(res, {
            statusCode: 200,
            success: true,
            data: specialities,
            message: "Specialities fetched successfully",
        });
    })

const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const speciality = await SpecialityService.deleteSpeciality(id as string);
    sentResponse(res, {
        statusCode: 200,
        success: true,
        data: speciality,
        message: "Speciality deleted successfully",
    });
})


const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const speciality = await SpecialityService.updateSpeciality(id as string, payload);
    sentResponse(res, {
        statusCode: 200,
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
