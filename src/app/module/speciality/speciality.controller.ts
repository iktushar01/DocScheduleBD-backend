import { SpecialityService } from "./speciality.service";

import { Request, Response } from "express";

const createSpeciality = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const speciality = await SpecialityService.createSpeciality(payload);
        return res.status(201).json({
            success: true,
            data: speciality,
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to create speciality" });
    }
}

const getAllSpecialities = async (req: Request, res: Response) => {
    try {
        const specialities = await SpecialityService.getAllSpecialities();
        return res.status(200).json({
            success: true,
            data: specialities,
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to get specialities" });
    }
}


const deleteSpeciality = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const speciality = await SpecialityService.deleteSpeciality(id as string);
        return res.status(200).json({
            success: true,
            data: speciality,
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete speciality" });
    }
}


const updateSpeciality = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const speciality = await SpecialityService.updateSpeciality(id as string, payload);
        return res.status(200).json({
            success: true,
            data: speciality,
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to update speciality" });
    }
}

export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality
}
