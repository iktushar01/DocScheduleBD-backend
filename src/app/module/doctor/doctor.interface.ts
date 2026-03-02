import { Gender } from "../../../generated/prisma";

export interface IupdateDoctorPayload {
    name: string;
    email: string;
    profilePhoto: string;
    contactNumber: string;
    address: string;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
}