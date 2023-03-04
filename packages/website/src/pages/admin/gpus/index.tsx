import { NextPageContext } from 'next';
import { AdminListGpusPage } from '../../../client/admin/pages';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(_ctx: NextPageContext) {
  return await viewModelsClient.get('admin/gpus/list');
}

export default AdminListGpusPage;
