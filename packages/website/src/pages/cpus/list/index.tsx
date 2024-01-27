import {
  generateListCpusQueryFromSearchParams,
  ListCpusRequest,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListCpusPage } from 'packages/website/src/client/product/pages/cpu/ListCpusPage/ListCpusPage';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = generateListCpusQueryFromSearchParams({ query: ctx.query });
  const benchmark = ctx.query.cpu_benchmark as string;

  const response = await viewModelsClient.get('cpus/list', {
    params: {
      req: JSON.stringify({
        query,
      } as ListCpusRequest),
    },
    nextPageContext: ctx,
    preferredBenchmarks: { cpu: benchmark },
  });
  return response;
}

export default ListCpusPage;
