import { ApiContext } from '@server/shared/api/context';
import { staffController } from '@server/shared/api/controller';
import { ProductMetas } from '@shared/product-meta';
import { productService } from './product-service';

export const autocompleteProductMeta = staffController(
  async (ctx: ApiContext) => {
    const key = ctx.req.query['key'] as keyof ProductMetas;
    const query = ctx.req.query['value'] as string;
    return await productService.autocompleteMeta(key, query ?? '', ctx);
  },
);
