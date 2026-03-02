import { Gender } from "../../../generated/prisma";

export interface ICreateDoctorPayload {
    password: string;
    doctor: {
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
    specialities: string[];
}