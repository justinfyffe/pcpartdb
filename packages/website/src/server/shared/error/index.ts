import { HttpErrorType } from '@pcpartdb/website/shared/error';

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
