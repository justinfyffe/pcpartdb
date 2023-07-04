import Joi from '@hapi/joi';
import { cpuValidator, ListCpusOrder, ListCpusSort } from '@pcpartdb/shared';

const MAX_LIMIT_CPUS_QUERY = 100;

export const cpuPresetsValidator = Joi.string();

export const listCpusFilterValidator = Joi.object({
  company: Joi.array().items(Joi.string()).allow('', null),
  segment: Joi.array().items(Joi.string()).allow('', null),

  performanceRated: Joi.boolean(),
  valueRated: Joi.boolean(),
}).options({ abortEarly: false });

export const listCpusOrderByValidator = Joi.object({
  sort: Joi.string()
    .valid(
      ListCpusSort.Id,
      ListCpusSort.Name,
      ListCpusSort.PerformanceRating,
      ListCpusSort.ValueRating,
      ListCpusSort.ReleaseDate,
    )
    .allow('', null),
  order: Joi.string()
    .valid(ListCpusOrder.Asc, ListCpusOrder.Desc)
    .allow('', null),
}).options({ abortEarly: false });

export const listCpusPaginationValidator = Joi.object({
  offset: Joi.number().min(0),
  limit: Joi.number().positive().max(MAX_LIMIT_CPUS_QUERY),
}).options({ abortEarly: false });

export const listCpusQueryValidator = Joi.object({
  filter: listCpusFilterValidator.allow(null),
  orderBy: listCpusOrderByValidator.allow(null),
  pagination: listCpusPaginationValidator.allow(null),
}).options({ abortEarly: false });

export const listCpusRequestValidator = Joi.object({
  query: listCpusQueryValidator.allow(null),
  fields: Joi.array().allow(Joi.string()).allow(null),
}).options({ abortEarly: false });

export const createCpuRequestValidator = cpuValidator;
export const updateCpuRequestValidator = cpuValidator;
