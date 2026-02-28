import { Role, User, UserStatus } from "../../../generated/prisma";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterPatient {
    name: string;
    email: string;
    password: string;
}

interface ILoginUser {
    email: string;
    password: string;
}

const registerPatient = async (payload: IRegisterPatient) => {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        }
    })

    if (!data.user) {
        throw new Error("User registration failed")
    }

    //:TODO: create patient profile 
    const patient = await prisma.$transaction(async (tx) => {
        const patientTx = await tx.patient.create({
            data: {
                userId: data.user.id,
                name: payload.name,
                email: payload.email,
            },
        });
        return {
            ...data,
            patient: patientTx,
        };
    });

    return patient;
}

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    })

    if (data.user.status === UserStatus.SUSPENDED) {
        throw new Error("User is suspended")
    }

    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new Error("User is deleted")
    }

    if (!data.user) {
        throw new Error("User login failed")
    }

    return data
}

export const AuthService = {
    registerPatient,
    loginUser
}