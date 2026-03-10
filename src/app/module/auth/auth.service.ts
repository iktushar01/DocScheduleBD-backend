import { Role, User, UserStatus } from "../../../generated/prisma";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { StatusCodes } from "http-status-codes";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../admin/admin.interface";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";


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

const getMe = async (user : IRequestUser) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
        include: {
            patient: {
                include: {
                    appointments: true,
                    reviews: true,
                    prescriptions: true,
                    medicalReports: true,
                    patientHealthData: true,
                }
            },
            doctor: {
                include: {
                    specialties: true,
                    appointments: true,
                    reviews: true,
                    prescriptions: true,
                }
            },
            admin: true,
        }
    })
    if(!isUserExist){
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }
    return isUserExist;
}

const getNewTokens = async (refreshToken : string, sessionToken : string) => {
    const isSessionTokenExist = await prisma.session.findUnique({
        where: {
            token: sessionToken
        },
        include: {
            user: true,
        }
    })
    if(!isSessionTokenExist){
        throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid session token");
    }
    
    const varifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);

    if (!varifiedRefreshToken.success || !varifiedRefreshToken.decoded) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const { decoded } = varifiedRefreshToken;

    const newAccessToken = tokenUtils.getAccessToken({
        userId: decoded.userId,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email,
        status: decoded.status,
        isDeleted: decoded.isDeleted,
        emailVerified: decoded.emailVerified,
    })
    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: decoded.userId,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email,
        status: decoded.status,
        isDeleted: decoded.isDeleted,
        emailVerified: decoded.emailVerified,
    })


    const {token} = await prisma.session.update({
        where: {
            token: sessionToken
        },
        data: {
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
        }
    })
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        updatedToken: token,
    }
    
}

export const AuthService = {
    registerPatient,
    loginUser,
    getMe,
    getNewTokens
}