import { ApiError, HttpErrorType } from './error-types';

export function isApiError(error: any): error is ApiError {
  return 'type' in error && 'statusCode' in error;
}

export function isNotFoundError(error: any) {
  return isApiError(error) && error.type === HttpErrorType.NotFoundError;
}
