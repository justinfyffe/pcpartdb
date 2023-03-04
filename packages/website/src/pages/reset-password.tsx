import { NextPageContext } from 'next';
import { ResetPasswordPage } from '../client/auth/pages';

export async function getServerSideProps(ctx: NextPageContext) {
  const token = ctx.query.token as string;
  return { props: { token } };
}

export default ResetPasswordPage;
