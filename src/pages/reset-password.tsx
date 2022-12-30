import { ResetPasswordPage } from '@client/auth/pages';
import { SsrContext } from '@server/shared/ssr/context';
import { guestSsrPageProps } from '@server/shared/ssr/props';

export const getServerSideProps = guestSsrPageProps(async (ctx: SsrContext) => {
  const { token } = ctx.page.query as { token: string };
  return { token };
});

export default ResetPasswordPage;
