import { NextPageContext } from 'next';
import { ListGpusPage } from '../../../client/gpus/pages';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(ctx: NextPageContext) {
  const params = ctx.query;
  return await viewModelsClient.get('gpus/list', { params });
}

export default ListGpusPage;
