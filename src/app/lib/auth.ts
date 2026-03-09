import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma";
import { envVars } from "../../config/env";
import ms, { StringValue } from "ms";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: { type: "string", required: true, defaultValue: Role.PATIENT },
            status: { type: "string", required: true, defaultValue: UserStatus.ACTIVE },
            needPasswordChange: { type: "boolean", required: true, defaultValue: true },
            isDeleted: { type: "boolean", required: true, defaultValue: false },
            deletedAt: { type: "date", required: false, defaultValue: null },
            lastLogin: { type: "date", required: false, defaultValue: null },
            lastIpAddress: { type: "string", required: false, defaultValue: null },
            lastUserAgent: { type: "string", required: false, defaultValue: null },
            failedLoginAttempts: { type: "number", required: true, defaultValue: 0 },
            lockedUntil: { type: "date", required: false, defaultValue: null },
        }
    },

    session: {
        expiresIn: ms(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue),
        updateAge: ms(envVars.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as StringValue),
        cookieCache: {
            enabled: true,
            maxAge: ms(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue),
            cookieOptions: {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: "/",
            }
        }
    },


    trustedOrigins: [envVars.BETTER_AUTH_URL || "http://localhost:5000", envVars.FRONTEND_URL || "http://localhost:3000"],

    advanced: {
        disableCSRFCheck: true
    }
});