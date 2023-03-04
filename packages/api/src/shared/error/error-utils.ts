import { ValidationError } from '@hapi/joi';
import { HttpErrorType, ValidationPropertyError } from '@pcpartdb/shared';

export class ServerError extends Error {
  readonly type: HttpErrorType;
  readonly data?: unknown;

  constructor(type: HttpErrorType, data?: unknown) {
    super();

    this.type = type;
    this.data = data;
  }
}

export function getErrorStatusCode(type: HttpErrorType) {
  switch (type) {
    case HttpErrorType.BadRequestError:
      return 400;
    case HttpErrorType.ForbiddenError:
      return 403;
    case HttpErrorType.InternalServerError:
      return 500;
    case HttpErrorType.NotFoundError:
      return 404;
    case HttpErrorType.UnauthorizedError:
      return 401;
    default:
      return 500;
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

export function joiValidationError(error: ValidationError) {
  const errors: ValidationPropertyError[] = [];
  error.details.forEach((errorItem) => {
    errors.push({
      property: errorItem.context.key,
      constraint: convertJoiToCamelCase(errorItem.type),
    });
  });

  return badRequestError(errors);
}

function convertJoiToCamelCase(type: string) {
  const typeWords = type.split('.');
  let result = '';
  typeWords.forEach((word, index) => {
    if (index === 0) {
      result += word;
    } else {
      result += word.substr(0, 1).toUpperCase() + word.substr(1);
    }
  });

  return result;
}
