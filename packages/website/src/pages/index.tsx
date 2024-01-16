import { ApiError } from '@pcpartdb/shared';
import { NextPageContext } from 'next';
import HomePage from '../client/home/pages/HomePage/HomePage';
import { viewModelsClient } from '../client/shared/api/viewModelsClient';

export async function getServerSideProps(ctx: NextPageContext) {
  try {
    const response = await viewModelsClient.get('home', {
      nextPageContext: ctx,
    });
    return { props: response };
  } catch (error) {
    ctx.res.statusCode = (error as ApiError)?.statusCode ?? 500;
    return { props: { error } };
  }
}

export default HomePage;
