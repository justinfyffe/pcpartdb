import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ViewCpuPage } from 'packages/website/src/client/product/pages/cpu/ViewCpuPage/ViewCpuPage';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  const slug = ctx.query.slug as string;

  const endpoint = joinUrlParts('cpus/view', slug);
  const response = await viewModelsClient.get(endpoint, {
    headers: { cookie: ctx.req?.headers?.cookie ?? '' },
  });
  return response;
}

export default ViewCpuPage;
