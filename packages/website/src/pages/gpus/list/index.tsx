import {
  generateGpusQueryFromSearchParams,
  ListGpusRequest,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListGpusPage } from '../../../client/gpus/pages';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = generateGpusQueryFromSearchParams(ctx.query);

  const request: ListGpusRequest = { query };

  return await viewModelsClient.get('gpus/list', {
    params: { q: JSON.stringify(request) },
  });
}

export default ListGpusPage;
