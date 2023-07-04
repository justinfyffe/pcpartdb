import { generateListGpusQueryFromSearchParams } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListGpusPage } from 'packages/website/src/client/product';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = generateListGpusQueryFromSearchParams(ctx.query);

  return await viewModelsClient.get('gpus/list', {
    params: { q: JSON.stringify(query) },
  });
}

export default ListGpusPage;
