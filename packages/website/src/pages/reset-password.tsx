import { NextPageContext } from 'next';
import { ResetPasswordPage } from '../client/auth/pages/ResetPasswordPage/ResetPasswordPage';
import { withGuestGuard } from '../client/shared/guards/withGuestGuard';

export async function getServerSideProps(ctx: NextPageContext) {
  const token = ctx.query.token as string;
  return { props: { token } };
}

export default withGuestGuard(ResetPasswordPage);
