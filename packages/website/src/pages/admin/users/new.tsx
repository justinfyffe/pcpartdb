import { AdminNewUserPage } from '@pcpartdb/website/client/admin/pages';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { staffSsrPageProps } from '@pcpartdb/website/server/shared/ssr/props';

export const getServerSideProps = staffSsrPageProps(
  async (_ctx: SsrContext) => {},
);

export default AdminNewUserPage;
