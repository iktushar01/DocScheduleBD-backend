import { envVars } from "../../../config/env";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import ms, { StringValue } from "ms";

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

export const AuthController = {
    registerPatient,
    loginUser
}