import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiError, ApiErrorType } from '../../../shared/error';

interface HttpErrorData {
  type: ApiErrorType;
  data: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log(exception.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: HttpErrorData | null = null;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = exception.getResponse() as HttpErrorData;
    }

    response.status(status).json({
      type: error?.type || this.getDefaultType(exception as HttpException),
      statusCode: status,
      timestamp: new Date().toISOString(),
      data: error?.data,
      stack: exception.stack,
    } as ApiError);
  }

  private getDefaultType(exception: HttpException) {
    if (exception instanceof BadRequestException) {
      return ApiErrorType.BadRequestError;
    } else if (exception instanceof ForbiddenException) {
      return ApiErrorType.ForbiddenError;
    } else if (exception instanceof NotFoundException) {
      return ApiErrorType.NotFoundError;
    } else if (exception instanceof UnauthorizedException) {
      return ApiErrorType.UnauthorizedError;
    } else {
      return ApiErrorType.InternalServerError;
    }
  }
}
