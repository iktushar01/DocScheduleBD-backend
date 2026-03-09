import { envVars } from "../../config/env";
import { jwtUtils } from "./jwt";
import { JwtPayload } from "jsonwebtoken";


const getAccessToken = (payload : JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN });
    return accessToken;
}

const getRefreshToken = (payload : JwtPayload) => {
    const refreshToken = jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN });
    return refreshToken;
}

export const tokenUtils = {
    getAccessToken,
    getRefreshToken
}
