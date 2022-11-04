import { LoginPage } from '@client/auth/components';
import { SsrContext } from '@server/shared/ssr/context';
import { guestSsrPageProps } from '@server/shared/ssr/props';

export const getServerSideProps = guestSsrPageProps(
  async (_ctx: SsrContext) => {},
);

export default LoginPage;
