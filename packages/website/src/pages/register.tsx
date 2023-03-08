import {
  HttpErrorType,
  NotFoundError,
  RegisterViewModel,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { RegisterPage } from '../client/auth/pages';
import { withGuestGuard } from '../client/shared/guards';
import { viewModelsClient } from '../client/shared/view-models';

export async function getServerSideProps(_ctx: NextPageContext) {
  const response = await viewModelsClient.get<RegisterViewModel>('register');
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
