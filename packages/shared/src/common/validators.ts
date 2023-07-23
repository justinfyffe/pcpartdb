import Joi from '@hapi/joi';
import { ListOrder, ListSort } from './lists';

const DEFAULT_MAX_LIMIT = 10;

interface ListQueryValidatorOptions {
  filterValidator?: Joi.ObjectSchema;
  maxLimit?: number;
}

export function listQueryValidator(options: ListQueryValidatorOptions) {
  const orderByValidator = Joi.object({
    sort: Joi.string().valid(ListSort.Id, ListSort.Name).allow('', null),
    order: Joi.string().valid(ListOrder.Asc, ListOrder.Desc).allow('', null),
  }).options({ abortEarly: false });

  const paginationValidator = Joi.object({
    offset: Joi.number().min(0),
    limit: Joi.number()
      .positive()
      .max(options.maxLimit ?? DEFAULT_MAX_LIMIT),
  }).options({ abortEarly: false });

  return Joi.object({
    filter: options.filterValidator ?? Joi.any(),
    orderBy: orderByValidator.allow(null),
    pagination: paginationValidator.allow(null),
  });
}
