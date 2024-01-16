import {
  ApiError,
  HttpErrorType,
  NotFoundError,
  RegisterViewModel,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { RegisterPage } from '../client/auth/pages/RegisterPage/RegisterPage';
import { viewModelsClient } from '../client/shared/api/viewModelsClient';
import { withGuestGuard } from '../client/shared/guards/withGuestGuard';

export async function getServerSideProps(ctx: NextPageContext) {
  try {
    const response = await viewModelsClient.get<RegisterViewModel>('register', {
      nextPageContext: ctx,
    });

    if (response.totalUsers && response.totalUsers > 0) {
      const error: NotFoundError = {
        type: HttpErrorType.NotFoundError,
        statusCode: 404,
        timestamp: new Date().toISOString(),
      };
      ctx.res.statusCode = 404;
      return { props: { error } };
    }

    return { props: {} };
  } catch (error) {
    ctx.res.statusCode = (error as ApiError)?.statusCode ?? 500;
    return { props: { error } };
  }
}

export default withGuestGuard(RegisterPage);
