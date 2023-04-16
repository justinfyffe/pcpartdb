import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ViewGpuPage } from '../../../client/gpus/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const slug = ctx.query.slug as string;

  const endpoint = joinUrlParts('gpus/view', slug);
  return await viewModelsClient.get(endpoint);
}

export default ViewGpuPage;
