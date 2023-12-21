import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { CompareCpusPage } from 'packages/website/src/client/product/pages/cpu/CompareCpusPage/CompareCpusPage';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const slug = ctx.query.slug as string;
  const benchmark = ctx.query.cpu_benchmark as string;

  const endpoint = joinUrlParts('cpus/compare', slug);
  const response = await viewModelsClient.get(endpoint, {
    nextPageContext: ctx,
    preferredBenchmarks: { cpu: benchmark },
  });
  return response;
}

export default CompareCpusPage;
