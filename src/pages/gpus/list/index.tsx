import { ListGpusPage, ListGpusPageProps } from '@client/product';
import { transaction } from '@server/db/database';
import { productService } from '@server/product/product-service';
import { serializeAsync } from '@server/shared/types/serialize';
import { ProductType } from '@shared/product';
import { NextPageContext } from 'next';

export async function getServerSideProps(_ctx: NextPageContext) {
  return transaction(async (trx) => {
    const gpus = await serializeAsync(
      productService.list({ type: ProductType.GPU }, { trx }),
    );

    const pageProps: ListGpusPageProps = {
      gpus: JSON.parse(JSON.stringify(gpus)),
    };

    return { props: pageProps };
  });
}

export default ListGpusPage;
