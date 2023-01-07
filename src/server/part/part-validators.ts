import Joi from '@hapi/joi';
import { benchmarksValidator } from '@shared/benchmark';
import { PartOrder, PartSort, PartType } from '@shared/part';
import { partImagesValidator } from '@shared/part-image';
import { partMetasValidator } from '@shared/part-meta';
import { specsValidator } from '@shared/spec';

export const partsFilterValidator = Joi.object({
  company: Joi.array().items(Joi.string()).allow('', null),
  architecture: Joi.array().items(Joi.string()).allow('', null),
  year: Joi.array().items(Joi.number()).allow('', null),

  performanceRated: Joi.boolean(),
  valueRated: Joi.boolean(),
});

export const partsOrderByValidator = Joi.object({
  sort: Joi.string()
    .valid(
      PartSort.Id,
      PartSort.Name,
      PartSort.PerformanceRating,
      PartSort.ValueRating,
      PartSort.ReleaseDate,
    )
    .allow('', null),
  order: Joi.string().valid(PartOrder.Asc, PartOrder.Desc).allow('', null),
});

export const partsQueryValidator = Joi.object({
  filter: partsFilterValidator.allow(null),
  orderBy: partsOrderByValidator.allow(null),
});

export const listPartsRequestValidator = Joi.object({
  type: Joi.string().valid(PartType.CPU, PartType.GPU),
  query: partsQueryValidator,
}).options({ abortEarly: false });

export const createPartRequestValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(PartType.CPU, PartType.GPU),
  name: Joi.string().required(),
  // TODO: add validator for unique keys
  metas: partMetasValidator,
  specs: specsValidator,
  benchmarks: benchmarksValidator,
  images: partImagesValidator,
}).options({ abortEarly: false });

export const updatePartRequestValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(PartType.CPU, PartType.GPU),
  name: Joi.string().required(),
  // TODO: add validator for unique keys
  metas: partMetasValidator,
  specs: specsValidator,
  benchmarks: benchmarksValidator,
  images: partImagesValidator,
}).options({ abortEarly: false });

export const autocompletePartsRequestValidator = Joi.object({
  type: Joi.string().required(),
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

export const autocompletePartMetasRequestValidator = Joi.object({
  key: Joi.string().required(),
  query: Joi.string().required(),
}).options({
  abortEarly: false,
});
