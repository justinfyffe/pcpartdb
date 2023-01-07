import {
  AdminListUsersPage,
  AdminListUsersPageProps,
} from '@client/admin/pages';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import { userService } from '@server/user/user-service';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const users = await getUsers(ctx);

  return { users } as AdminListUsersPageProps;
});

async function getUsers(ctx: Context) {
  const users = await userService.list(ctx);
  return serialize(users);
}

export default AdminListUsersPage;
