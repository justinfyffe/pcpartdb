import { ErrorOption } from 'react-hook-form';
import {
  ApiError,
  ApiErrorType,
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../../../types/error';

export function isInternalServerError(
  error: ApiError,
): error is InternalServerError {
  return error.type === ApiErrorType.InternalServerError;
}

export function isBadRequestError(error: ApiError): error is BadRequestError {
  return error.type === ApiErrorType.BadRequestError;
}

export function isForbiddenError(error: ApiError): error is ForbiddenError {
  return error.type === ApiErrorType.ForbiddenError;
}

export function isUnauthorizedError(
  error: ApiError,
): error is UnauthorizedError {
  return error.type === ApiErrorType.UnauthorizedError;
}

export function isNotFoundError(error: ApiError): error is NotFoundError {
  return error.type === ApiErrorType.NotFoundError;
}

export function setValidationErrors(
  error: ApiError,
  setError: (name: string, error: ErrorOption) => void,
) {
  if (!isBadRequestError(error)) {
    return;
  }

  error.data?.forEach((validationError) => {
    setError(validationError.property, { type: validationError.constraint });
  });
}
