import {
  generateListGpusQueryFromSearchParams,
  ListGpusRequest,
  ProductType,
} from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListGpusPage } from 'packages/website/src/client/product/pages/gpu/ListGpusPage/ListGpusPage';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = generateListGpusQueryFromSearchParams(ctx.query);

  const response = await viewModelsClient.get('gpus/list', {
    params: {
      req: JSON.stringify({
        productType: ProductType.Gpu,
        query,
      } as ListGpusRequest),
    },
  });
  return response;
}

export default ListGpusPage;
