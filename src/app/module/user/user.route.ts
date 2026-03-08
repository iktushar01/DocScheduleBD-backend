import { Router } from "express";
import { UserController } from "./user.controller";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Gender } from "../../../generated/prisma";


export const createDoctorZodSchema = z.object({
    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(100)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),

    specialities: z
        .array(
            z.string().uuid("Invalid speciality ID")
        )
        .min(1, "At least one speciality is required")
        .max(10, "Too many specialities"),

    doctor: z.object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(100)
            .regex(/^[a-zA-Z\s.]+$/, "Name can only contain letters"),

        email: z
            .string()
            .trim()
            .email("Invalid email address")
            .toLowerCase(),

        profilePhoto: z
            .string()
            .trim()
            .url("Profile photo must be a valid URL"),

        contactNumber: z
            .string()
            .trim()
            .regex(/^[\d\s\-\+]{10,15}$/, "Invalid contact number. Use actual digits (no 'X')."),

        address: z
            .string()
            .trim()
            .min(5, "Address is too short")
            .max(200),

        gender: z.enum([Gender.MALE, Gender.FEMALE]),

        appointmentFee: z
            .number({
                error: (issue) => {
                    if (issue.code === "invalid_type" && issue.input === undefined) {
                        return "Appointment fee is required";
                    }
                    return "Appointment fee must be a number";
                },
            })
            .positive("Appointment fee must be positive")
            .max(50000, "Fee is too high"),

        qualification: z
            .string()
            .trim()
            .min(2, "Qualification required")
            .max(100),

        currentWorkingPlace: z
            .string()
            .trim()
            .min(2, "Working place required")
            .max(150),

        designation: z
            .string()
            .trim()
            .min(2, "Designation required")
            .max(100),
    }),
});

const router = Router();



router.post('/create-doctor', (req: Request, res: Response, next: NextFunction) => {
    const parseResult = createDoctorZodSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: parseResult.error.issues,
        });
    }
    next();
}, UserController.createDoctor);





// router.post('/create-admin', UserController.createAdmin);
// router.post('/create-super-admin', UserController.createSuperAdmin);

export const UserRoutes = router;