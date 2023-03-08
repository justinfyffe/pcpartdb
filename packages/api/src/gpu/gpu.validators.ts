import Joi from '@hapi/joi';
import {
  gpuBenchmarksValidator,
  gpuFieldValidator,
  gpuMetaValidator,
  GpuOrder,
  GpuSort,
  gpuSpecsValidator,
} from '@pcpartdb/shared';

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
});

export const listGpusRequestValidator = Joi.object({
  query: gpusQueryValidator.allow(null),
}).options({ abortEarly: false });

export const createGpuRequestValidator = Joi.object({
  slug: Joi.string().required(),
  name: Joi.string().required(),
  company: gpuFieldValidator.allow(null),
  marketSegment: gpuFieldValidator.allow(null),
  launchPrice: gpuFieldValidator.allow(null),
  releaseDate: gpuFieldValidator.allow(null),
  specs: gpuSpecsValidator.allow(null),
  benchmarks: gpuBenchmarksValidator.allow(null),
  images: Joi.array().allow(Joi.any()),
  meta: gpuMetaValidator.allow(null),
}).options({ abortEarly: false });

export const updateGpuRequestValidator = Joi.object({
  slug: Joi.string().required(),
  name: Joi.string().required(),
  company: gpuFieldValidator.allow(null),
  marketSegment: gpuFieldValidator.allow(null),
  launchPrice: gpuFieldValidator.allow(null),
  releaseDate: gpuFieldValidator.allow(null),
  specs: gpuSpecsValidator.allow(null),
  benchmarks: gpuBenchmarksValidator.allow(null),
  images: Joi.array().allow(Joi.any()),
  meta: gpuMetaValidator.allow(null),
}).options({ abortEarly: false });

export const autocompleteGpusRequestValidator = Joi.object({
  query: Joi.string().allow(''),
}).options({
  abortEarly: false,
});

export const autocompleteSpecsRequestValidator = Joi.object({
  key: Joi.string().required(),
  query: Joi.string().required(),
}).options({
  abortEarly: false,
});
