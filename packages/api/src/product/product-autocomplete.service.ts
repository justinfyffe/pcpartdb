import Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import { mapToProductDtos } from '@pcpartdb/database';
import {
  AutocompleteProductsResponse,
  productAutocompleteQuerySchema,
  ProductFieldKey,
  productFieldKeySchema,
  ProductType,
  productTypeSchema,
} from '@pcpartdb/shared';
import { Context } from '../shared/context';
import { validate } from '../shared/validation/validate';
import { ProductAutocompleteRepository } from './product-autocomplete.repository';

interface AutocompleteProductsOptions {
  productType: ProductType;
  query: string;
  fields?: ProductFieldKey[];
}

const autocompleteProductsOptionsSchema = Joi.object({
  productType: productTypeSchema.required(),
  query: productAutocompleteQuerySchema.allow(''),
  fields: Joi.array().items(productFieldKeySchema).allow(null),
});

@Injectable()
export class ProductAutocompleteService {
  constructor(private repository: ProductAutocompleteRepository) {}

  async autocomplete(options: AutocompleteProductsOptions, ctx: Context) {
    validate(options, autocompleteProductsOptionsSchema);

    const { productType, query } = options;
    const fields = options.fields != null ? new Set(options.fields) : null;

    const rawResults = await this.repository.autocomplete(
      productType,
      query,
      ctx,
    );
    const results = await mapToProductDtos(rawResults, { fields });

    return { results } as AutocompleteProductsResponse;
  }
}
