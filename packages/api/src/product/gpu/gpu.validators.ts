import Joi from '@hapi/joi';
import { gpuValidator, ListGpusOrder, ListGpusSort } from '@pcpartdb/shared';

const MAX_LIMIT_GPUS_QUERY = 100;

export const gpuPresetsValidator = Joi.string();

export const listGpusFilterValidator = Joi.object({
  company: Joi.array().items(Joi.string()).allow('', null),
  segment: Joi.array().items(Joi.string()).allow('', null),

  performanceRated: Joi.boolean().allow(null),
  valueRated: Joi.boolean().allow(null),

  chipsetId: Joi.number().min(0).allow(null),
  isChipset: Joi.boolean().allow(null),
  isRetailModel: Joi.boolean().allow(null),
}).options({ abortEarly: false });

export const listGpusOrderByValidator = Joi.object({
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

export const listGpusPaginationValidator = Joi.object({
  offset: Joi.number().min(0),
  limit: Joi.number().positive().max(MAX_LIMIT_GPUS_QUERY),
}).options({ abortEarly: false });

export const listGpusQueryValidator = Joi.object({
  filter: listGpusFilterValidator.allow(null),
  orderBy: listGpusOrderByValidator.allow(null),
  pagination: listGpusPaginationValidator.allow(null),
}).options({ abortEarly: false });

export const listGpusRequestValidator = Joi.object({
  query: listGpusQueryValidator.allow(null),
  fields: Joi.array().allow(Joi.string()).allow(null),
}).options({ abortEarly: false });

export const createGpuRequestValidator = gpuValidator;
export const updateGpuRequestValidator = gpuValidator;
