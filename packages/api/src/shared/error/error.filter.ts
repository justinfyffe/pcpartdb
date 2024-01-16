import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
} from '@nestjs/common';
import { ApiError, HttpErrorType } from '@pcpartdb/shared';
import { getErrorStatusCode, ServerError } from './utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(e: Error, host: ArgumentsHost) {
    console.log(e.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (e instanceof ServerError) {
      response.status(getErrorStatusCode(e.type)).json({
        type: e?.type,
        statusCode: getErrorStatusCode(e.type),
        timestamp: new Date().toISOString(),
        data: e?.data,
      } as ApiError);
    } else if (e instanceof ForbiddenException) {
      response.status(getErrorStatusCode(HttpErrorType.ForbiddenError)).json({
        type: HttpErrorType.ForbiddenError,
        statusCode: getErrorStatusCode(HttpErrorType.ForbiddenError),
        timestamp: new Date().toISOString(),
      } as ApiError);
    } else {
      response
        .status(500)
        .json({ type: HttpErrorType.InternalServerError, statusCode: 500 });
    }
  }
}
