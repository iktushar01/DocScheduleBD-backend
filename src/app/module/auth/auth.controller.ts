import { envVars } from "../../../config/env";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AuthService } from "./auth.service";

const registerPatient = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;
    const data = await AuthService.registerPatient({ name, email, password });

    res.cookie("better-auth.session_token", data.token, {
        httpOnly: true,
        secure: envVars.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Patient registered successfully",
        data
    })
})

const loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const data = await AuthService.loginUser({ email, password });

    res.cookie("better-auth.session_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully",
        data
    })
})

export const AuthController = {
    registerPatient,
    loginUser
}