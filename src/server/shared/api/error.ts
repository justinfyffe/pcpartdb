import { ValidationError } from '@hapi/joi';
import { ApiError, ValidationPropertyError } from '@shared/error';
import { NextApiResponse } from 'next';
import { getErrorStatusCode, ServerError } from '../error';
import { ApiContext } from './context';
import { badRequestError } from './status';

export function errorHandler(ctx: ApiContext, e: Error | ServerError) {
  const res = ctx.res as NextApiResponse;

  if (e instanceof ServerError) {
    console.log(e.stack);

    res.status(getErrorStatusCode(e.type)).json({
      type: e?.type,
      statusCode: getErrorStatusCode(e.type),
      timestamp: new Date().toISOString(),
      data: e?.data,
      stack: e.stack,
    } as ApiError);
  } else if (e instanceof Error) {
    console.log(e.stack);
    res.status(500).send({});
  } else {
    res.status(500).send({});
  }
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
