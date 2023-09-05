import { generateListGpusQueryFromSearchParams } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListGpusPage } from 'packages/website/src/client/product/pages/gpu/ListGpusPage/ListGpusPage';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = generateListGpusQueryFromSearchParams(ctx.query);

  return await viewModelsClient.get('gpus/list', {
    params: { q: JSON.stringify(query) },
  });
}

export default ListGpusPage;
