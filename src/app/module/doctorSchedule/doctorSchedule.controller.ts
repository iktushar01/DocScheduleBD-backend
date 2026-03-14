import { Request, Response } from "express";
import { IRequestUser } from "../auth/auth.interface";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { StatusCodes } from "http-status-codes";

const createMyDoctorSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const user = req.user as IRequestUser;
    const doctorSchedule = await DoctorScheduleService.createMyDoctorSchedule(user, payload);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: 'Doctor schedule created successfully',
        data: doctorSchedule
    });
});

const getMyDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const query = req.query;
    const result = await DoctorScheduleService.getMyDoctorSchedules(user, query as IQueryParams);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Doctor schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});

const getAllDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result  = await DoctorScheduleService.getAllDoctorSchedules(query as IQueryParams);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'All doctor schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});

const getDoctorScheduleById = catchAsync(async (req: Request, res: Response) => {
    const doctorId = req.params.doctorId;
    const scheduleId = req.params.scheduleId;
    const doctorSchedule = await DoctorScheduleService.getDoctorScheduleById(doctorId as string, scheduleId as string);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Doctor schedule retrieved successfully',
        data: doctorSchedule
    });
});

const updateMyDoctorSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const user = req.user as IRequestUser;
    const updatedDoctorSchedule = await DoctorScheduleService.updateMyDoctorSchedule(user, payload);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,  
        message: 'Doctor schedule updated successfully',
        data: updatedDoctorSchedule
    });
});

const deleteMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = req.user as IRequestUser;
    await DoctorScheduleService.deleteMyDoctorSchedule(id as string, user);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Doctor schedule deleted successfully',
    });
});


export const DoctorScheduleController = {
    createMyDoctorSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    updateMyDoctorSchedule,
    deleteMyDoctorSchedule
}