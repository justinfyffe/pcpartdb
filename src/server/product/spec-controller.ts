import { ApiContext } from '@server/shared/api/context';
import { staffController } from '@server/shared/api/controller';
import { Specs } from '@shared/spec';
import { productService } from './product-service';

export const autocompleteSpecs = staffController(async (ctx: ApiContext) => {
  const key = ctx.req.query['key'] as keyof Specs;
  const query = ctx.req.query['value'] as string;
  return await productService.autocompleteSpec(key, query ?? '', ctx);
});
