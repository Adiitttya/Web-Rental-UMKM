import { ApiResponse, PaginatedMeta, PaginatedResponse } from '../types/api-response';

export function successResponse<T>(data?: T, message?: string, meta?: Record<string, unknown>): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    meta,
  };
}

export function errorResponse(message: string, code = 'INTERNAL_ERROR', details?: unknown): ApiResponse<never> {
  return {
    success: false,
    message,
    error: {
      code,
      details,
    },
  };
}

export function paginatedResponse<T>(
  data: T[],
  pagination: PaginatedMeta,
  message?: string
): PaginatedResponse<T> {
  return {
    success: true,
    message,
    data,
    pagination,
  };
}
