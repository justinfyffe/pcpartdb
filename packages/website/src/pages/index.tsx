import { NextPageContext } from 'next';
import HomePage from '../client/home/pages/HomePage/HomePage';
import { viewModelsClient } from '../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  return await viewModelsClient.get('home', {
    headers: { cookie: ctx.req?.headers?.cookie ?? undefined },
  });
}

export default HomePage;
