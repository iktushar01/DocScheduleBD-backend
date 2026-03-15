import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { PrescriptionService } from './prescription.service';
import { IRequestUser } from '../auth/auth.interface';

const givePrescription = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user as IRequestUser;
    const result = await PrescriptionService.givePrescription(user, payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Prescription created successfully',
        data: result,
    });
});

const myPrescriptions = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const result = await PrescriptionService.myPrescriptions(user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Prescription fetched successfully',
        data: result
    });
});

const getAllPrescriptions = catchAsync(async (req: Request, res: Response) => {
    const result = await PrescriptionService.getAllPrescriptions();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Prescriptions retrieval successfully',
        data: result
    });
});

const updatePrescription = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const prescriptionId = req.params.id;
    const payload = req.body;
    const result = await PrescriptionService.updatePrescription(user, prescriptionId as string, payload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Prescription updated successfully',
        data: result
    });
});

const deletePrescription = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const prescriptionId = req.params.id;
    const result = await PrescriptionService.deletePrescription(user, prescriptionId as string);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Prescription deleted successfully',
        data: result
    });
});

export const PrescriptionController = {
    givePrescription,
    myPrescriptions,
    getAllPrescriptions,
    updatePrescription,
    deletePrescription
};