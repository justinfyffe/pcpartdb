import {
  AdminListUsersPage,
  AdminListUsersPageProps,
} from '@client/admin/pages';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { userService } from '@server/user/user-service';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const users = await getUsers(ctx);

  return { users } as AdminListUsersPageProps;
});

async function getUsers(ctx: Context) {
  return await userService.list(ctx);
}

export default AdminListUsersPage;
