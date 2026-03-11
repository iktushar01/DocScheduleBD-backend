import { envVars } from "../../../config/env";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import ms, { StringValue } from "ms";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "./auth.interface";
import { Request, Response } from "express";
import { cookieUtils } from "../../utils/cookies";

const registerPatient = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;

    const result = await AuthService.registerPatient({ name, email, password });

    const { accessToken, refreshToken, token, ...rest } = result;

    res.cookie("better-auth.session_token", token, {
        httpOnly: true,
        secure: envVars.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ms(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue),
    });

    tokenUtils.getAccessTokenFromCookie(res, accessToken ?? '');
    tokenUtils.getRefreshTokenFromCookie(res, refreshToken ?? '');
    tokenUtils.getBetterAuthAccessToken(res, token ?? '');

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Patient registered successfully",
        data: {
            ...rest,
            accessToken,
            refreshToken,
            token
        }
    })
})

const loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.loginUser({ email, password });
    const { accessToken, refreshToken, token, ...rest } = result;

    tokenUtils.getAccessTokenFromCookie(res, accessToken ?? '');
    tokenUtils.getRefreshTokenFromCookie(res, refreshToken ?? '');
    tokenUtils.getBetterAuthAccessToken(res, token ?? '');

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User logged in successfully",
        data: {
            ...rest,
            accessToken,
            refreshToken,
            token
        }
    })
})

const getMe = catchAsync(async (req, res) => {
    const user = req.user as IRequestUser;
    const result = await AuthService.getMe(user);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User fetched successfully",
        data: result,
    })
})

const getNewTokens = catchAsync(async (req, res) => {
    const oldRefreshToken = req.cookies.refreshToken;
    const sessionToken = req.cookies["better-auth.session_token"];

    if (!oldRefreshToken || !sessionToken) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh token or session token not found");
    }

    const result = await AuthService.getNewTokens(oldRefreshToken, sessionToken);
    const { accessToken, refreshToken, updatedToken } = result;

    tokenUtils.getAccessTokenFromCookie(res, accessToken);
    tokenUtils.getRefreshTokenFromCookie(res, refreshToken);
    tokenUtils.getBetterAuthAccessToken(res, updatedToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Tokens fetched successfully",
        data: {
            accessToken,
            refreshToken,
            updatedToken
        }
    })
})


const changePassword = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];

        const result = await AuthService.changePassword(payload, betterAuthSessionToken);

        const { accessToken, refreshToken, token } = result;

        tokenUtils.getAccessTokenFromCookie(res, accessToken);
        tokenUtils.getRefreshTokenFromCookie(res, refreshToken);
        tokenUtils.getBetterAuthAccessToken(res, token as string);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Password changed successfully",
            data: result,
        });
    }
)


const logoutUser = catchAsync(
    async (req: Request, res: Response) => {
        const betterAuthSessionToken = req.cookies["better-auth.session_token"];
        const result = await AuthService.logoutUser(betterAuthSessionToken);
        cookieUtils.clearCookie(res, 'accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        cookieUtils.clearCookie(res, 'refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        cookieUtils.clearCookie(res, 'better-auth.session_token', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "User logged out successfully",
            data: result,
        });
    }
)

const verifyEmail = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        await AuthService.verifyEmail(email, otp);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Email verified successfully",
        });
    }
)

const forgetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        await AuthService.forgetPassword(email);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Password reset OTP sent to email successfully",
        });
    }
)

const resetPassword = catchAsync(
    async (req: Request, res: Response) => {
        const { email, otp, newPassword } = req.body;
        await AuthService.resetPassword(email, otp, newPassword);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "Password reset successfully",
        });
    }
)


export const AuthController = {
    registerPatient,
    loginUser,
    getMe,
    getNewTokens,
    changePassword,
    logoutUser,
    verifyEmail,
    forgetPassword,
    resetPassword,
}