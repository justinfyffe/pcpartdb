import {
  ApiError,
  BadRequestError,
  ForbiddenError,
  HttpErrorType,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '@shared/error';
import { UseFormSetError } from 'react-hook-form';

export function isInternalServerError(
  error: ApiError,
): error is InternalServerError {
  return error.type === HttpErrorType.InternalServerError;
}

export function isBadRequestError(error: ApiError): error is BadRequestError {
  return error.type === HttpErrorType.BadRequestError;
}

export function isForbiddenError(error: ApiError): error is ForbiddenError {
  return error.type === HttpErrorType.ForbiddenError;
}

export function isUnauthorizedError(
  error: ApiError,
): error is UnauthorizedError {
  return error.type === HttpErrorType.UnauthorizedError;
}

export function isNotFoundError(error: ApiError): error is NotFoundError {
  return error.type === HttpErrorType.NotFoundError;
}

export function setValidationErrors<T>(
  error: ApiError,
  setError: UseFormSetError<T>,
) {
  if (!isBadRequestError(error)) {
    return;
  }

  error.data?.forEach((validationError) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setError(validationError.property as any, {
      type: validationError.constraint,
    });
  });
}
