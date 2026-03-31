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

export type ApiResponse<Data, Meta = Record<string, never>> = {
  data: Data;
  meta?: Meta;
  error?: ApiError;
};

export type PaginatedResponse<Data> = ApiResponse<Data[], PaginationMeta>;
