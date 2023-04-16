import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { CompareGpuPage } from '../../../client/gpus/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const slug = ctx.query.slug as string;

  const endpoint = joinUrlParts('gpus/compare', slug);
  return await viewModelsClient.get(endpoint);
}

export default CompareGpuPage;
