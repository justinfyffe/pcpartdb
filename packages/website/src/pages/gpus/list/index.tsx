import { generateGpusQueryFromSearchParams } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListGpusPage } from '../../../client/gpus/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = generateGpusQueryFromSearchParams(ctx.query);

  return await viewModelsClient.get('gpus/list', {
    params: { q: JSON.stringify(query) },
  });
}

export default ListGpusPage;
