import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ApiError, HttpErrorType } from '@pcpartdb/shared';
import { getErrorStatusCode, ServerError } from './error-utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(e: Error, host: ArgumentsHost) {
    console.log(e.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (e instanceof ServerError) {
      response.status(status).json({
        type: e?.type,
        statusCode: getErrorStatusCode(e.type),
        timestamp: new Date().toISOString(),
        data: e?.data,
        stack: e.stack,
      } as ApiError);
    } else {
      response
        .status(500)
        .json({ type: HttpErrorType.InternalServerError, statusCode: 500 });
    }
  }
}
