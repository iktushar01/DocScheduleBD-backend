export interface TypeErrorSource {
    path: string;
    message: string;
}

export interface TypeErrorResponse {
    statusCode: number;
    message: string;
    errorSources: TypeErrorSource[];
}