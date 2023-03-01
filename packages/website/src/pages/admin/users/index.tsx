import {
  AdminListUsersPage,
  AdminListUsersPageProps,
} from '@pcpartdb/website/client/admin/pages';
import { Context } from '@pcpartdb/website/server/shared/context';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { staffSsrPageProps } from '@pcpartdb/website/server/shared/ssr/props';
import { userService } from '@pcpartdb/website/server/user/user-service';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const users = await getUsers(ctx);

  return { users } as AdminListUsersPageProps;
});

async function getUsers(ctx: Context) {
  return await userService.list(ctx);
}

export default AdminListUsersPage;
