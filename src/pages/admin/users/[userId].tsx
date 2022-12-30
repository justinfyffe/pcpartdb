import { AdminEditUserPage, AdminEditUserPageProps } from '@client/admin/pages';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serializeAsync } from '@server/shared/types/serialize';
import { userService } from '@server/user/user-service';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const query = ctx.page.query as { userId: string };
  const userId = parseInt(query.userId, 10);

  const user = await serializeAsync(userService.get(userId, ctx));

  return { user } as AdminEditUserPageProps;
});

export default AdminEditUserPage;
