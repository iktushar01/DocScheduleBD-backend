import { catchAsync } from "../../shared/catchAsync";
import { SpecialityService } from "./speciality.service";

import { Request, Response } from "express";

const createSpeciality = catchAsync(async (req: Request, res: Response) => {
        const payload = req.body;
        const speciality = await SpecialityService.createSpeciality(payload);
        return res.status(201).json({
            success: true,
            data: speciality,
        });
    })

const getAllSpecialities = catchAsync(async (req: Request, res: Response) => {
        const specialities = await SpecialityService.getAllSpecialities();
        return res.status(200).json({
            success: true,
            data: specialities,
        });
    })

const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const speciality = await SpecialityService.deleteSpeciality(id as string);
    return res.status(200).json({
        success: true,
        data: speciality,
    });
})


const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const speciality = await SpecialityService.updateSpeciality(id as string, payload);
    return res.status(200).json({
        success: true,
        data: speciality,
    });
})

export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality
}
