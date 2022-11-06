import { OverviewGpusPage, OverviewGpusPageProps } from '@client/product';
import { NextPageContext } from 'next';

export async function getServerSideProps(_ctx: NextPageContext) {
  const pageProps = {} as OverviewGpusPageProps;

  return { props: pageProps };
}

export default OverviewGpusPage;
