import { LoginPage } from '@pcpartdb/website/client/auth/pages';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { guestSsrPageProps } from '@pcpartdb/website/server/shared/ssr/props';

export const getServerSideProps = guestSsrPageProps(
  async (_ctx: SsrContext) => {},
);

export default LoginPage;
