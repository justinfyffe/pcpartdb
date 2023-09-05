import { NextPageContext } from 'next';
import HomePage from '../client/home/pages/HomePage/HomePage';
import { viewModelsClient } from '../client/shared/api/viewModelsClient';

export async function getServerSideProps(_ctx: NextPageContext) {
  return await viewModelsClient.get('home');
}

export default HomePage;
