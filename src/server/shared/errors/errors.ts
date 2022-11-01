import { ValidationError } from '@hapi/joi';
import { ApiErrorType, ValidationPropertyError } from '@shared/error';

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

export class ServerError extends Error {
  readonly data: unknown;

  constructor(data: unknown) {
    super();

    this.data = data;
  }
}

export function notFoundError(data: unknown) {
  throw new ServerError({ type: ApiErrorType.NotFoundError, data });
}

export function forbiddenError() {
  throw new ServerError({ type: ApiErrorType.ForbiddenError });
}

export function unauthorizedError() {
  throw new ServerError({ type: ApiErrorType.UnauthorizedError });
}

export function badRequestError(
  data?: ValidationPropertyError | ValidationPropertyError[],
) {
  let dataArray;
  if (data != null) {
    dataArray = Array.isArray(data) ? data : [data];
  }

  throw new ServerError({
    type: ApiErrorType.BadRequestError,
    data: dataArray,
  });
}

export function internalServerError() {
  throw new ServerError({
    type: ApiErrorType.InternalServerError,
  });
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
