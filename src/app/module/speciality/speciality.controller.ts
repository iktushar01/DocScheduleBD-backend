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

export const SpecialityController = {
    createSpeciality,
}
