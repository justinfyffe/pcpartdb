import { ApiContext } from '@server/shared/api/context';
import { controller, staffController } from '@server/shared/api/controller';
import type { ImportPartRequest, PartRequest, PartType } from '@shared/part';
import { PartMetas } from '@shared/part-meta';
import { Specs } from '@shared/spec';
import { partImporterService } from './part-importer-service';
import { partService } from './part-service';

export const listParts = controller(async (ctx: ApiContext) => {
  const data = JSON.parse(ctx.req.query['q'] as string);
  return await partService.list(data, ctx);
});

export const autocompleteParts = controller(async (ctx: ApiContext) => {
  const type = ctx.req.query['type'] as PartType;
  const query = ctx.req.query['query'] as string;
  return await partService.autocomplete(type, query ?? '', ctx);
});

export const autocompleteSpecs = staffController(async (ctx: ApiContext) => {
  const key = ctx.req.query['key'] as keyof Specs;
  const query = ctx.req.query['value'] as string;
  return await partService.autocompleteSpec(key, query ?? '', ctx);
});

export const autocompletePartMetas = staffController(
  async (ctx: ApiContext) => {
    const key = ctx.req.query['key'] as keyof PartMetas;
    const query = ctx.req.query['value'] as string;
    return await partService.autocompleteMeta(key, query ?? '', ctx);
  },
);

export const createPart = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body as PartRequest;
  return await partService.create(body, ctx);
});

export const updatePart = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  const body = ctx.req.body as PartRequest;
  return await partService.update(id, body, ctx);
});

export const deletePart = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  return await partService.delete(id, ctx);
});

export const importPart = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body as ImportPartRequest;
  return partImporterService.import(body);
});
