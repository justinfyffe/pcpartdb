import { ApiError, ApiErrorType } from '@shared/error';
import { NextApiRequest, NextApiResponse } from 'next';
import { ServerError } from './errors';

export function withErrorFilter(
  controller: (req: NextApiRequest, res: NextApiResponse) => unknown,
) {
  const func = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await controller(req, res);
    } catch (e) {
      if (e instanceof ServerError) {
        console.log(e.stack);

        res.status(getStatusCode(e.type)).json({
          type: e?.type,
          statusCode: getStatusCode(e.type),
          timestamp: new Date().toISOString(),
          data: e?.data,
          stack: e.stack,
        } as ApiError);
      } else if (e instanceof Error) {
        console.log(e.stack);
        res.status(500);
      } else {
        res.status(500);
      }
    }
  };

  return func;
}

function getStatusCode(type: ApiErrorType) {
  switch (type) {
    case ApiErrorType.BadRequestError:
      return 400;
    case ApiErrorType.ForbiddenError:
      return 403;
    case ApiErrorType.InternalServerError:
      return 500;
    case ApiErrorType.NotFoundError:
      return 404;
    case ApiErrorType.UnauthorizedError:
      return 401;
    default:
      return 500;
  }
}
