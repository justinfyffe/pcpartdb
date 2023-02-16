import Joi from '@hapi/joi';
import {
  gpuBenchmarksValidator,
  gpuFieldValidator,
  GpuOrder,
  GpuSort,
  gpuSpecsValidator,
} from '@shared/gpus';

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
  query: gpusQueryValidator,
}).options({ abortEarly: false });

export const createGpuRequestValidator = Joi.object({
  slug: Joi.string().required(),
  name: Joi.string().required(),
  company: gpuFieldValidator,
  marketSegment: gpuFieldValidator,
  launchPrice: gpuFieldValidator,
  releaseDate: gpuFieldValidator,
  specs: gpuSpecsValidator,
  benchmarks: gpuBenchmarksValidator,
  images: Joi.array().allow(Joi.any()),
}).options({ abortEarly: false });

export const updateGpuRequestValidator = Joi.object({
  slug: Joi.string().required(),
  name: Joi.string().required(),
  company: gpuFieldValidator,
  marketSegment: gpuFieldValidator,
  launchPrice: gpuFieldValidator,
  releaseDate: gpuFieldValidator,
  specs: gpuSpecsValidator,
  benchmarks: gpuBenchmarksValidator,
  images: Joi.array().allow(Joi.any()),
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
