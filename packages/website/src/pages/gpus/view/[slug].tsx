import { NextPageContext } from 'next';
import { ViewGpuPage } from '../../../client/gpus/pages';
import { viewModelsClient } from '../../../client/shared/view-models';

export async function getServerSideProps(ctx: NextPageContext) {
  const slug = ctx.query.slug as string;
  return await viewModelsClient.get(`gpus/view/${slug}`);
}

export default ViewGpuPage;
