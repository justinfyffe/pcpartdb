import {
  generateGpusQueryFromSearchParams,
  ListGpusRequest,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminListGpusPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = generateGpusQueryFromSearchParams(ctx.query);

  const request: ListGpusRequest = { query };

  return await viewModelsClient.get('admin/gpus/list', {
    params: { q: JSON.stringify(request) },
  });
}

export default withStaffGuard(AdminListGpusPage);
