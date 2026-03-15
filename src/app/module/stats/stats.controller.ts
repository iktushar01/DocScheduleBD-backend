import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { StatsService } from "./stats.service";
import { IRequestUser } from "../auth/auth.interface";

const getDashboardStatsData = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const result = await StatsService.getDashboardStatsData(user);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Stats data retrieved successfully!",
        data: result
    })
});

export const StatsController = {
    getDashboardStatsData
}