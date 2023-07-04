import { generateListCpusQueryFromSearchParams } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ListCpusPage } from 'packages/website/src/client/product';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const query = generateListCpusQueryFromSearchParams(ctx.query);

  return await viewModelsClient.get('cpus/list', {
    params: { q: JSON.stringify(query) },
  });
}

export default ListCpusPage;
