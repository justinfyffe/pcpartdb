import { ApiContext } from '@server/shared/api/context';
import { controller, staffController } from '@server/shared/api/controller';
import { validate } from '@server/shared/types/validate';
import {
  CreateGpuRequest,
  ImportGpuDataRequest,
  ListGpusRequest,
  UpdateGpuRequest,
} from '@shared/gpus';
import { GpuSpecsEntity } from './gpu-entity';
import { gpuImporterService } from './gpu-importer-service';
import { gpuService } from './gpu-service';
import {
  autocompleteGpusRequestValidator,
  autocompleteSpecsRequestValidator,
  createGpuRequestValidator,
  listGpusRequestValidator,
  updateGpuRequestValidator,
} from './gpu-validators';

export const listGpus = controller(async (ctx: ApiContext) => {
  const data = JSON.parse(ctx.req.query['q'] as string) as ListGpusRequest;
  validate(data, listGpusRequestValidator);
  return await gpuService.list(
    { ...data, includeRanks: true, includeImages: false },
    ctx,
  );
});

export const autocompleteGpus = controller(async (ctx: ApiContext) => {
  const query = ctx.req.query['query'] as string;
  validate({ query }, autocompleteGpusRequestValidator);
  return await gpuService.autocomplete(query ?? '', ctx);
});

export const autocompleteSpecs = staffController(async (ctx: ApiContext) => {
  const key = ctx.req.query['key'] as keyof GpuSpecsEntity;
  const query = ctx.req.query['value'] as string;
  validate({ key, query }, autocompleteSpecsRequestValidator);
  return await gpuService.autocompleteSpec(key, query ?? '', ctx);
});

export const createGpu = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body as CreateGpuRequest;
  validate(body, createGpuRequestValidator);

  return await gpuService.create(body, ctx);
});

export const updateGpu = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  const body = ctx.req.body as UpdateGpuRequest;
  validate(body, updateGpuRequestValidator);

  return await gpuService.update(id, body, ctx);
});

export const deleteGpu = staffController(async (ctx: ApiContext) => {
  const id = Number(ctx.req.query['id'] as string);
  return await gpuService.delete(id, ctx);
});

export const importGpuData = staffController(async (ctx: ApiContext) => {
  const body = ctx.req.body as ImportGpuDataRequest;
  return gpuImporterService.importData(body);
});
