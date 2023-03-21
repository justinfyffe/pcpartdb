import { NextPageContext } from 'next';
import { CompareGpuPage } from '../../../client/gpus/pages';
import { viewModelsClient } from '../../../client/shared/api';

export async function getServerSideProps(ctx: NextPageContext) {
  const slug = ctx.query.slug as string;
  return await viewModelsClient.get(`gpus/compare/${slug}`);
}

export default CompareGpuPage;
