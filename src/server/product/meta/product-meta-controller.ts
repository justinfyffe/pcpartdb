import { ApiContext } from '@server/shared/api/context';
import { staffController } from '@server/shared/api/controller';
import { ProductMetaKey } from '@shared/product-meta';
import { productMetaService } from './product-meta-service';

export const autocompleteProductMeta = staffController(
  async (ctx: ApiContext) => {
    const key = ctx.req.query['key'] as ProductMetaKey;
    const query = ctx.req.query['value'] as string;
    return await productMetaService.autocomplete(key, query ?? '', ctx);
  },
);
