import { HttpErrorType, SsrError } from '@shared/error';
import { getErrorStatusCode, ServerError } from '../error';

export function errorHandler(e: Error | ServerError) {
  const error = getErrorProps(e);
  if (error.type === HttpErrorType.UnauthorizedError) {
    return { redirect: { destination: '/login', permanent: false } };
  } else if (error.type === HttpErrorType.NotFoundError) {
    return { notFound: true };
  }

  return error;
}

function getErrorProps(e: Error | ServerError) {
  if (e instanceof ServerError) {
    console.log(e.stack);

    return {
      type: e?.type,
      statusCode: getErrorStatusCode(e.type),
      timestamp: new Date().toISOString(),
      data: e?.data,
      stack: e.stack,
    } as SsrError;
  } else {
    console.log(e.stack);
    return { type: HttpErrorType.InternalServerError, statusCode: 500 };
  }
}
