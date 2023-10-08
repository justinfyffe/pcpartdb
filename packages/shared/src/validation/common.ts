import Joi from '@hapi/joi';
import { ListOrder, ListSort } from '../common';

export const listOrderSchema = Joi.string().valid(
  ListOrder.Asc,
  ListOrder.Desc,
);

export const listSortSchema = Joi.string().valid(
  ListSort.Id,
  ListSort.Name,
  ListSort.PerformancePerMsrp,
  ListSort.PerformanceRating,
  ListSort.ReleaseDate,
);

export const orderBySchema = Joi.object({
  sort: listSortSchema.allow('', null),
  order: listOrderSchema.allow('', null),
}).options({ abortEarly: false });

export const paginationSchema = (limit: number) =>
  Joi.object({
    offset: Joi.number().min(0),
    limit: Joi.number().positive().max(limit),
  }).options({ abortEarly: false });

export interface ListQuerySchemaOptions {
  filterSchema?: Joi.ObjectSchema;
  maxLimit: number;
}

export const listQuerySchema = (options: ListQuerySchemaOptions) =>
  Joi.object({
    filter: options.filterSchema ?? Joi.any(),
    orderBy: orderBySchema.allow(null),
    pagination: paginationSchema(options.maxLimit).allow(null),
  });
