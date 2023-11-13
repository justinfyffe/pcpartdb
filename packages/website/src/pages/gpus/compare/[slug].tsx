import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { CompareGpusPage } from 'packages/website/src/client/product/pages/gpu/CompareGpusPage/CompareGpusPage';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const slug = ctx.query.slug as string;

  const endpoint = joinUrlParts('gpus/compare', slug);
  const response = await viewModelsClient.get(endpoint, {
    headers: { cookie: ctx.req?.headers?.cookie ?? '' },
  });
  return response;
}

export default CompareGpusPage;
