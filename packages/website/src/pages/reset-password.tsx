import { ResetPasswordPage } from '@pcpartdb/website/client/auth/pages';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { guestSsrPageProps } from '@pcpartdb/website/server/shared/ssr/props';

export const getServerSideProps = guestSsrPageProps(async (ctx: SsrContext) => {
  const { token } = ctx.page.query as { token: string };
  return { token };
});

export default ResetPasswordPage;
