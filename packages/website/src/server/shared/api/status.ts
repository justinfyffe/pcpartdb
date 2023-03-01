import {
  HttpErrorType,
  ValidationPropertyError,
} from '@pcpartdb/website/shared/error';
import { ServerError } from '../error';
import { ApiContext } from './context';

export function ok<T = unknown>(response: T, ctx: ApiContext) {
  const { res } = ctx;

  if (!res.headersSent) {
    res.status(200).json(response);
  }
}

export function notFoundError<T = unknown>(response?: T) {
  return new ServerError(HttpErrorType.NotFoundError, response);
}

export function forbiddenError() {
  return new ServerError(HttpErrorType.ForbiddenError);
}

export function unauthorizedError() {
  return new ServerError(HttpErrorType.UnauthorizedError);
}

export function badRequestError(
  data?: ValidationPropertyError | ValidationPropertyError[],
) {
  let dataArray;
  if (data != null) {
    dataArray = Array.isArray(data) ? data : [data];
  }

  return new ServerError(HttpErrorType.BadRequestError, dataArray);
}

export function internalServerError() {
  return new ServerError(HttpErrorType.InternalServerError);
}
