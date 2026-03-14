import { Request, Response } from "express";

import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AppointmentService } from "./appointment.service";
import { StatusCodes } from "http-status-codes";
import { IRequestUser } from "../auth/auth.interface";

const bookAppointment = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const user = req.user as IRequestUser;
    const appointment = await AppointmentService.bookAppointment(payload, user);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED, 
        message: 'Appointment booked successfully',
        data: appointment
    });
});

const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const appointments = await AppointmentService.getMyAppointments(user);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Appointments retrieved successfully',
        data: appointments
    });
});

const changeAppointmentStatus = catchAsync(async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const payload = req.body;
    const user = req.user as IRequestUser;

    const updatedAppointment = await AppointmentService.changeAppointmentStatus(appointmentId as string, payload, user);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Appointment status updated successfully',
        data: updatedAppointment
    });
});

const getMySingleAppointment = catchAsync(async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const user = req.user as IRequestUser;

    const appointment = await AppointmentService.getMySingleAppointment(appointmentId as string, user);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Appointment retrieved successfully',
        data: appointment
    });
});

const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
    const appointments = await AppointmentService.getAllAppointments();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'All appointments retrieved successfully',
        data: appointments
    });
});

const bookAppointmentWithPayLater = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user as IRequestUser;
    const appointment = await AppointmentService.bookAppointmentWithPayLater(payload, user);
    sendResponse(res, {
        success: true,  
        statusCode: StatusCodes.CREATED,
        message: 'Appointment booked successfully with Pay Later option',
        data: appointment
    });
});

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
    const appointmentId = req.params.id;
    const user = req.user as IRequestUser;
    const paymentInfo = await AppointmentService.initiatePayment(appointmentId as string, user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Payment initiated successfully',
        data: paymentInfo
    });
});

export const AppointmentController = {
    bookAppointment,
    getMyAppointments,
    changeAppointmentStatus,
    getMySingleAppointment,
    getAllAppointments,
    bookAppointmentWithPayLater,
    initiatePayment,
}