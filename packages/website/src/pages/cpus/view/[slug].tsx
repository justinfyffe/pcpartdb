import { joinUrlParts } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import { ViewCpuPage } from 'packages/website/src/client/product/pages/cpu/ViewCpuPage/ViewCpuPage';
import { viewModelsClient } from '../../../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  console.time('ViewCpuPage.getServerSideProps');
  const slug = ctx.query.slug as string;

  const endpoint = joinUrlParts('cpus/view', slug);
  const response = await viewModelsClient.get(endpoint);
  console.timeEnd('ViewCpuPage.getServerSideProps');
  return response;
}

export default ViewCpuPage;
