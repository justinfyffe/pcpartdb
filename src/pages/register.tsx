import { RegisterPage } from '@client/auth/pages';
import { notFoundError } from '@server/shared/api/status';
import { SsrContext } from '@server/shared/ssr/context';
import { guestSsrPageProps } from '@server/shared/ssr/props';
import { userService } from '@server/user/user-service';

export const getServerSideProps = guestSsrPageProps(async (ctx: SsrContext) => {
  const totalUsers = await userService.count(ctx);
  if (totalUsers !== 0) {
    throw notFoundError();
  }
});

export default RegisterPage;
