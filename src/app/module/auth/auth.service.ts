import { Role, User, UserStatus } from "../../../generated/prisma";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { StatusCodes } from "http-status-codes";
import { tokenUtils } from "../../utils/token";

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
        throw new AppError(StatusCodes.BAD_REQUEST, "User registration failed");
    }

    //:TODO: create patient profile 
    const patient = await prisma.$transaction(async (tx) => {
        try {
            const patientTx = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: payload.name,
                    email: payload.email,
                },
            });

            const accessToken = tokenUtils.getAccessToken({
                userId: data.user.id,
                role: data.user.role as Role,
                name: data.user.name,
                email: data.user.email,
                status: data.user.status as UserStatus,
                isDeleted: !!data.user.isDeleted,
                emailVerified: data.user.emailVerified,
            });

            const refreshToken = tokenUtils.getRefreshToken({
                userId: data.user.id,
                role: data.user.role as Role,
                name: data.user.name,
                email: data.user.email,
                status: data.user.status as UserStatus,
                isDeleted: !!data.user.isDeleted,
                emailVerified: data.user.emailVerified,
            });

            return {
                ...data,
                patient: patientTx,
                accessToken,
                refreshToken,
                token: data.token,
            };
        } catch (error) {
            await tx.patient.delete({
                where: {
                    userId: data.user.id,
                },
            });
            throw error;
        }
    })

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
        throw new AppError(StatusCodes.BAD_REQUEST, "User is suspended");
    }

    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted");
    }

    if (!data.user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "User login failed");
    }

    const { user } = data;
    const accessToken = tokenUtils.getAccessToken({
        userId: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: user.emailVerified,
    })
    const refreshToken = tokenUtils.getRefreshToken({
        userId: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: user.emailVerified,
    })
    return {
        ...data,
        accessToken,
        refreshToken,
        token: data.token,
    }
}

export const AuthService = {
    registerPatient,
    loginUser
}