import { ApiContext } from '@server/shared/api/context';
import { staffController } from '@server/shared/api/controller';
import type { SpecKey } from '@shared/spec';
import { specService } from './spec-service';

export const autocompleteSpecs = staffController(async (ctx: ApiContext) => {
  const key = ctx.req.query['key'] as SpecKey;
  const query = ctx.req.query['value'] as string;
  return await specService.autocomplete(key, query ?? '', ctx);
});
