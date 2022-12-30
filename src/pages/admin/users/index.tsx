import {
  AdminListUsersPage,
  AdminListUsersPageProps,
} from '@client/admin/pages';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serializeAsync } from '@server/shared/types/serialize';
import { userService } from '@server/user/user-service';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const users = await serializeAsync(userService.list(ctx));

  return { users } as AdminListUsersPageProps;
});

export default AdminListUsersPage;
