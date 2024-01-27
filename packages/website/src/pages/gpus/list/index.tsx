import {
  generateListGpusQueryFromSearchParams,
  ListGpusRequest,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListGpusPage } from 'packages/website/src/client/product/pages/gpu/ListGpusPage/ListGpusPage';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = generateListGpusQueryFromSearchParams({ query: ctx.query });
  const benchmark = ctx.query.gpu_benchmark as string;

  const response = await viewModelsClient.get('gpus/list', {
    params: {
      req: JSON.stringify({
        query,
      } as ListGpusRequest),
    },
    nextPageContext: ctx,
    preferredBenchmarks: { gpu: benchmark },
  });
  return response;
}

export default ListGpusPage;
