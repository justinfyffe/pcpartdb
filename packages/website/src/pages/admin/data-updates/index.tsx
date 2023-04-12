import {
  DataUpdateStatus,
  DEFAULT_LIST_DATA_UPDATES_LIMIT,
  DEFAULT_LIST_DATA_UPDATES_OFFSET,
  ListDataUpdatesRequest,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { AdminDataUpdatesPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/api';
import { withStaffGuard } from '../../../client/shared/guards';

export async function getServerSideProps(_ctx: NextPageContext) {
  const status = DataUpdateStatus.Pending;
  const offset = DEFAULT_LIST_DATA_UPDATES_OFFSET;
  const limit = DEFAULT_LIST_DATA_UPDATES_LIMIT;

  const request: ListDataUpdatesRequest = { status, offset, limit };

  return await viewModelsClient.get('admin/data-updates', {
    params: { q: JSON.stringify(request) },
  });
}

export default withStaffGuard(AdminDataUpdatesPage);
