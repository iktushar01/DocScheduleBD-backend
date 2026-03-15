import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IRequestUser } from "../auth/auth.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PatientService } from "./patient.service";


const updateMyProfile = catchAsync(async (req : Request, res : Response) =>{

    const user = req.user as IRequestUser;
    const payload = req.body;
 

    const result = await PatientService.updateMyProfile(user, payload);

    sendResponse(res, {
        success: true,
        statusCode : StatusCodes.OK,
        message : "Profile updated successfully",
        data : result
    });
})

export const PatientController = {
    updateMyProfile
}