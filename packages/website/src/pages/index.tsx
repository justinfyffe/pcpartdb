import { NextPageContext } from 'next';
import { HomePage } from '../client/home/pages';
import { viewModelsClient } from '../client/shared/api';

export async function getServerSideProps(_ctx: NextPageContext) {
  return await viewModelsClient.get('home');
}

export default HomePage;
