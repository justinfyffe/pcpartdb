import {
  ApiError,
  generateListGpusQueryFromSearchParams,
  ListGpusRequest,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListGpusPage } from 'packages/website/src/client/product/pages/gpu/ListGpusPage/ListGpusPage';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = generateListGpusQueryFromSearchParams({ query: ctx.query });
  const benchmark = ctx.query.gpu_benchmark as string;

  try {
    const response = await viewModelsClient.get('gpus/list', {
      params: {
        req: JSON.stringify({
          query,
        } as ListGpusRequest),
      },
      nextPageContext: ctx,
      preferredBenchmarks: { gpu: benchmark },
    });
    return { props: response };
  } catch (error) {
    ctx.res.statusCode = (error as ApiError)?.statusCode ?? 500;
    return { props: { error } };
  }
}

export default ListGpusPage;
