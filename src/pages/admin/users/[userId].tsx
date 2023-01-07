import { AdminEditUserPage, AdminEditUserPageProps } from '@client/admin/pages';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import { userService } from '@server/user/user-service';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const query = ctx.page.query as { userId: string };
  const userId = parseInt(query.userId, 10);

  const user = await getUser(userId, ctx);

  return { user } as AdminEditUserPageProps;
});

async function getUser(id: number, ctx: Context) {
  const user = await userService.get(id, ctx);
  return serialize(user);
}

export default AdminEditUserPage;
