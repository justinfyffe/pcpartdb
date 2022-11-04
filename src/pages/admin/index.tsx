import { AdminOverviewPage } from '@client/admin';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';

export const getServerSideProps = staffSsrPageProps(
  async (_ctx: SsrContext) => {},
);

export default AdminOverviewPage;
