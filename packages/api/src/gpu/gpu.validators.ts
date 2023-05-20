import Joi from '@hapi/joi';
import { gpuValidator, ListGpusOrder, ListGpusSort } from '@pcpartdb/shared';

const MAX_LIMIT_GPUS_QUERY = 100;

export const gpuPresetsValidator = Joi.string();

export const gpusFilterValidator = Joi.object({
  company: Joi.array().items(Joi.string()).allow('', null),
  segment: Joi.array().items(Joi.string()).allow('', null),

  performanceRated: Joi.boolean(),
  valueRated: Joi.boolean(),

  chipsetId: Joi.number().min(0),
  isChipset: Joi.boolean(),
  isRetailModel: Joi.boolean(),
}).options({ abortEarly: false });

export const gpusOrderByValidator = Joi.object({
  sort: Joi.string()
    .valid(
      ListGpusSort.Id,
      ListGpusSort.Name,
      ListGpusSort.PerformanceRating,
      ListGpusSort.ValueRating,
      ListGpusSort.ReleaseDate,
    )
    .allow('', null),
  order: Joi.string()
    .valid(ListGpusOrder.Asc, ListGpusOrder.Desc)
    .allow('', null),
}).options({ abortEarly: false });

export const gpusPaginationValidator = Joi.object({
  offset: Joi.number().min(0),
  limit: Joi.number().positive().max(MAX_LIMIT_GPUS_QUERY),
}).options({ abortEarly: false });

export const gpusQueryValidator = Joi.object({
  filter: gpusFilterValidator.allow(null),
  orderBy: gpusOrderByValidator.allow(null),
  pagination: gpusPaginationValidator.allow(null),
}).options({ abortEarly: false });

export const listGpusRequestValidator = Joi.object({
  query: gpusQueryValidator.allow(null),
  fields: Joi.array().allow(Joi.string()).allow(null),
}).options({ abortEarly: false });

export const createGpuRequestValidator = gpuValidator;
export const updateGpuRequestValidator = gpuValidator;
