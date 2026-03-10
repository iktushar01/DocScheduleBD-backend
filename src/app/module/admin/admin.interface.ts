export interface IUpdateAdminPayload {
    admin?: {
        name?: string;
        profilePhoto?: string;
        contactNumber?: string;
    }
}

export interface IRequestUser {
    userId: string;
    role: string;
    email: string;
    iat: number;
    exp: number;
}
