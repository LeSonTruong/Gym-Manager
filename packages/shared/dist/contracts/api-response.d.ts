export type ApiError = {
    code: string;
    message: string;
    details?: unknown;
};
export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
};
export type ApiResponse<TData, TMeta = Record<string, never>> = {
    data: TData;
    meta?: TMeta;
    error?: ApiError | null;
};
export type PaginatedResponse<TData> = ApiResponse<TData[], PaginationMeta>;
