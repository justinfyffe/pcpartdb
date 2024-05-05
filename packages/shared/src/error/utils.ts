import {
  ApiError,
  BadRequestError,
  ForbiddenError,
  HttpErrorType,
  InternalServerError,
  UnauthorizedError,
} from './error-types';

export function isApiError(error: any): error is ApiError {
  return error != null && 'type' in error && 'statusCode' in error;
}

export function isBadRequestError(error: any): error is BadRequestError {
  return isApiError(error) && error.type === HttpErrorType.BadRequestError;
}

export function isForbiddenError(error: any): error is ForbiddenError {
  return isApiError(error) && error.type === HttpErrorType.ForbiddenError;
}

export function isInternalServerError(
  error: any,
): error is InternalServerError {
  return isApiError(error) && error.type === HttpErrorType.InternalServerError;
}

export function isNotFoundError(error: any) {
  return isApiError(error) && error.type === HttpErrorType.NotFoundError;
}

export function isUnauthorizedError(error: any): error is UnauthorizedError {
  return isApiError(error) && error.type === HttpErrorType.UnauthorizedError;
}
