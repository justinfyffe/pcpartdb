import { NextPageContext } from 'next';
import { ResetPasswordPage } from '../client/auth/pages';
import { withGuestGuard } from '../client/shared/guards';

export async function getServerSideProps(ctx: NextPageContext) {
  const token = ctx.query.token as string;
  return { props: { token } };
}

export default withGuestGuard(ResetPasswordPage);
