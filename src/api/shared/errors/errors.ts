import { ValidationError } from '@hapi/joi';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiErrorType, ValidationPropertyError } from '../../../types/error';

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

export function notFoundError(data: unknown) {
  throw new NotFoundException({ type: ApiErrorType.NotFoundError, data });
}

export function forbiddenError() {
  throw new ForbiddenException({ type: ApiErrorType.ForbiddenError });
}

export function unauthorizedError() {
  throw new UnauthorizedException({ type: ApiErrorType.UnauthorizedError });
}

export function badRequestError(
  data?: ValidationPropertyError | ValidationPropertyError[],
) {
  let dataArray;
  if (data != null) {
    dataArray = Array.isArray(data) ? data : [data];
  }

  throw new BadRequestException({
    type: ApiErrorType.BadRequestError,
    data: dataArray,
  });
}

export function internalServerError() {
  throw new InternalServerErrorException({
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
