import Joi from '@hapi/joi';
import { GpuOrder, GpuSort, gpuValidator } from '@pcpartdb/shared';

const MAX_LIMIT_GPUS_QUERY = 100;

export const gpuPresetsValidator = Joi.string();

export const gpusFilterValidator = Joi.object({
  company: Joi.array().items(Joi.string()).allow('', null),

  performanceRated: Joi.boolean(),
  valueRated: Joi.boolean(),
});

export const gpusOrderByValidator = Joi.object({
  sort: Joi.string()
    .valid(
      GpuSort.Id,
      GpuSort.Name,
      GpuSort.PerformanceRating,
      GpuSort.ValueRating,
      GpuSort.ReleaseDate,
    )
    .allow('', null),
  order: Joi.string().valid(GpuOrder.Asc, GpuOrder.Desc).allow('', null),
});

export const gpusQueryValidator = Joi.object({
  filter: gpusFilterValidator.allow(null),
  orderBy: gpusOrderByValidator.allow(null),
  offset: Joi.number().min(0),
  limit: Joi.number().positive().max(MAX_LIMIT_GPUS_QUERY),
});

export const listGpusRequestValidator = Joi.object({
  query: gpusQueryValidator.allow(null),
  fields: Joi.array().allow(Joi.string()).allow(null),
}).options({ abortEarly: false });

export const createGpuRequestValidator = gpuValidator;
export const updateGpuRequestValidator = gpuValidator;
