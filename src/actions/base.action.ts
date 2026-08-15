import { ApiResponse } from '../types/api-response';
import { AppError } from '../lib/errors';
import { errorResponse, successResponse } from '../utils/response';
import { logger } from '../lib/logger';

export async function handleServerAction<T>(
  actionName: string,
  fn: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    logger.info(`Executing Action [${actionName}]`);
    const data = await fn();
    return successResponse(data);
  } catch (error) {
    logger.error(`Action Error [${actionName}]`, { error });

    if (error instanceof AppError) {
      return errorResponse(error.message, error.code, error.details);
    }

    // Mask internal error details in production mode for security hardening
    if (process.env.NODE_ENV === 'production') {
      return errorResponse('Terjadi kesalahan pada server. Silakan coba lagi nanti.', 'INTERNAL_SERVER_ERROR');
    }

    if (error instanceof Error) {
      return errorResponse(error.message, 'INTERNAL_SERVER_ERROR');
    }

    return errorResponse('Terjadi kesalahan yang tidak terduga.', 'UNKNOWN_ERROR');
  }
}
