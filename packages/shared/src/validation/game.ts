import Joi from '@hapi/joi';
import { listQuerySchema } from './common';

export const gameSchema = Joi.object({
  id: Joi.number().allow(null),

  name: Joi.string().required(),
  slug: Joi.string().required(),

  nameShort: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  publisher: Joi.string().allow('', null),
  developer: Joi.string().allow('', null),
  releaseDate: Joi.string().allow('', null),
  affiliateUrl: Joi.string().allow('', null),

  gameSettings: Joi.any().allow(null), // TODO
  scraperOptions: Joi.any().allow(null), // TODO

  minimumRequirements: Joi.any().allow(null), // TODO
  recommendedRequirements: Joi.any().allow(null), // TODO

  minimumGpuId: Joi.number().allow(null),
  recommendedGpuId: Joi.number().allow(null),
  minimumCpuId: Joi.number().allow(null),
  recommendedCpuId: Joi.number().allow(null),

  listingImageId: Joi.number().allow(null),

  metadata: Joi.any().allow(null), // TODO

  // TODO
  fps: Joi.any().allow(null),
  listingImage: Joi.any().allow(null),
  minimumGpu: Joi.any().allow(null),
  recommendedGpu: Joi.any().allow(null),
  minimumCpu: Joi.any().allow(null),
  recommendedCpu: Joi.any().allow(null),
});

export const listGamesFilterSchema = Joi.object({
  search: Joi.string().allow('', null),
});

export const listGamesRequestSchema = Joi.object({
  query: listQuerySchema({
    filterSchema: listGamesFilterSchema,
    maxLimit: 100,
  }),
  bypassCache: Joi.boolean().allow(null),
}).options({ abortEarly: false });

export const createGameRequestSchema = Joi.object({
  game: gameSchema,
}).options({ abortEarly: false });

export const updateGameRequestSchema = Joi.object({
  game: gameSchema,
}).options({ abortEarly: false });

export const gameAutocompleteQuerySchema = Joi.string().max(100);

export const autocompleteGamesRequestSchema = Joi.object({
  query: gameAutocompleteQuerySchema.allow('', null),
}).options({
  abortEarly: false,
});

export const scrapeGamesRequestSchema = Joi.object({
  externalUrl: Joi.string().required(),
  newGamesOnly: Joi.boolean().allow(null),
}).options({ abortEarly: false });
