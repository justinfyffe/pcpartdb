import { HomePage, HomePageProps } from '@client/home';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { serializeAsync } from '@server/shared/types/serialize';
import { ProductType } from '@shared/product';
import { NextPageContext } from 'next';

export async function getServerSideProps(_ctx: NextPageContext) {
  return transaction(async (trx) => {
    const nvidia = await serializeAsync(
      productService.list(
        { type: ProductType.GPU, filter: { company: 'nvidia' }, limit: 3 },
        { trx },
      ),
    );

    const amd = await serializeAsync(
      productService.list(
        { type: ProductType.GPU, filter: { company: 'amd' }, limit: 3 },
        { trx },
      ),
    );

    const pageProps: HomePageProps = {
      nvidiaGpus: JSON.parse(JSON.stringify(nvidia)),
      amdGpus: JSON.parse(JSON.stringify(amd)),
    };

    return { props: pageProps };
  });
}

export default HomePage;
