import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ViewGpuPage } from 'packages/website/src/client/product/pages/gpu/ViewGpuPage/ViewGpuPage';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const slug = ctx.query.slug as string;

  const endpoint = joinUrlParts('gpus/view', slug);
  return await viewModelsClient.get(endpoint);
}

export default ViewGpuPage;
