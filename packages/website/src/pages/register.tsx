import {
  HttpErrorType,
  NotFoundError,
  RegisterViewModel,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { RegisterPage } from '../client/auth/pages/RegisterPage/RegisterPage';
import { viewModelsClient } from '../client/shared/api/viewModelsClient';
import { withGuestGuard } from '../client/shared/guards/withGuestGuard';

export async function getServerSideProps(ctx: NextPageContext) {
  const response = await viewModelsClient.get<RegisterViewModel>('register', {
    headers: { cookie: ctx.req?.headers?.cookie ?? undefined },
  });
  if ('error' in response.props) {
    return response;
  }

  if ('totalUsers' in response.props && response.props.totalUsers > 0) {
    const error: NotFoundError = {
      type: HttpErrorType.NotFoundError,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    };
    return { props: { error } };
  }

  return { props: {} };
}

export default withGuestGuard(RegisterPage);
