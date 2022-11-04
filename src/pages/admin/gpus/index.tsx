import { AdminListGpusPage, AdminListGpusPageProps } from '@client/admin';
import { productService } from '@server/product/product-service';
import { SsrContext } from '@server/shared/ssr/context';
import { staffSsrPageProps } from '@server/shared/ssr/props';
import { serializeAsync } from '@server/shared/types/serialize';
import { ProductType } from '@shared/product';

export const getServerSideProps = staffSsrPageProps(async (ctx: SsrContext) => {
  const gpus = await serializeAsync(productService.list(ProductType.GPU, ctx));

  return {
    gpus: JSON.parse(JSON.stringify(gpus)),
  } as AdminListGpusPageProps;
});

export default AdminListGpusPage;
