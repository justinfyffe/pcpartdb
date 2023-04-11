import {
  DEFAULT_LIST_UPDATES_LIMIT,
  DEFAULT_LIST_UPDATES_OFFSET,
  ListPendingUpdatesRequest,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { withStaffGuard } from 'packages/website/src/client/shared/guards';
import { AdminPendingUpdatesPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(_ctx: NextPageContext) {
  const offset = DEFAULT_LIST_UPDATES_OFFSET;
  const limit = DEFAULT_LIST_UPDATES_LIMIT;

  const request: ListPendingUpdatesRequest = { offset, limit };

  return await viewModelsClient.get('admin/updates/pending', {
    params: { q: JSON.stringify(request) },
  });
}

export default withStaffGuard(AdminPendingUpdatesPage);
