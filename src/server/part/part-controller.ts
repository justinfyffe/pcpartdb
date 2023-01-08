import { ApiContext } from '@server/shared/api/context';
import { controller, staffController } from '@server/shared/api/controller';
import { validate } from '@server/shared/types/validate';
import * as fileUtils from '@server/shared/utils/file-utils';
import type {
  ExportPartsRequest,
  ImportPartialPartRequest,
  ListPartsRequest,
  PartRequest,
  PartType,
} from '@shared/part';
import { PartMetas } from '@shared/part-meta';
import { Specs } from '@shared/spec';
import { partImporterService } from './part-importer-service';
import { partService } from './part-service';
import {
  autocompletePartMetasRequestValidator,
  autocompletePartsRequestValidator,
  autocompleteSpecsRequestValidator,
  createPartRequestValidator,
  listPartsRequestValidator,
  updatePartRequestValidator,
} from './part-validators';

export const listParts = controller(async (ctx: ApiContext) => {
  const data = JSON.parse(ctx.req.query['q'] as string) as ListPartsRequest;
  validate(data, listPartsRequestValidator);
  return await partService.list(
    { ...data, includeRanks: true, includeImages: false },
    ctx,
  );
});

export const autocompleteParts = controller(async (ctx: ApiContext) => {
  const type = ctx.req.query['type'] as PartType;
  const query = ctx.req.query['query'] as string;
  validate({ type, query }, autocompletePartsRequestValidator);
  return await partService.autocomplete(type, query ?? '', ctx);
});

export const autocompleteSpecs = staffController(async (ctx: ApiContext) => {
  const key = ctx.req.query['key'] as keyof Specs;
  const query = ctx.req.query['value'] as string;
  validate({ key, query }, autocompleteSpecsRequestValidator);
  return await partService.autocompleteSpec(key, query ?? '', ctx);
});

export const autocompletePartMetas = staffController(
  async (ctx: ApiContext) => {
    const key = ctx.req.query['key'] as keyof PartMetas;
    const query = ctx.req.query['value'] as string;
    validate({ key, query }, autocompletePartMetasRequestValidator);
    return await partService.autocompleteMeta(key, query ?? '', ctx);
  },
);

export const createPart = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body as PartRequest;
  validate(body, createPartRequestValidator);

  return await partService.create(body, ctx);
});

export const updatePart = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  const body = ctx.req.body as PartRequest;
  validate(body, updatePartRequestValidator);

  return await partService.update(id, body, ctx);
});

export const deletePart = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  return await partService.delete(id, ctx);
});

export const importPartialPart = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body as ImportPartialPartRequest;
  return partImporterService.importPartialPart(body);
});

export const importParts = staffController(async (ctx: ApiContext) => {
  await fileUtils.uploadFile('file', ctx);

  const body = ctx.req.body;
  const filePath = body.tempPath;

  return partImporterService.importParts(filePath, ctx);
});

export const exportParts = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body as ExportPartsRequest;
  return await partImporterService.exportParts(body, ctx);
});
