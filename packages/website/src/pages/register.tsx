import { RegisterPage } from '@pcpartdb/website/client/auth/pages';
import { notFoundError } from '@pcpartdb/website/server/shared/api/status';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { guestSsrPageProps } from '@pcpartdb/website/server/shared/ssr/props';
import { userService } from '@pcpartdb/website/server/user/user-service';

export const getServerSideProps = guestSsrPageProps(async (ctx: SsrContext) => {
  const totalUsers = await userService.count(ctx);
  if (totalUsers !== 0) {
    throw notFoundError();
  }
});

export default RegisterPage;
