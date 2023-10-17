import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ViewGpuPage } from 'packages/website/src/client/product/pages/gpu/ViewGpuPage/ViewGpuPage';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  console.time('ViewGpuPage.getServerSideProps');
  const slug = ctx.query.slug as string;

  const endpoint = joinUrlParts('gpus/view', slug);
  const response = await viewModelsClient.get(endpoint);
  console.timeEnd('ViewGpuPage.getServerSideProps');
  return response;
}

export default ViewGpuPage;
