import Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import { ProductType } from '../../types/product';
import { ProductRepository } from './product.repository';

const productSpecValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.any(),
  source: Joi.string(),
}).options({ abortEarly: false });

const productBenchmarkValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  source: Joi.string(),
}).options({ abortEarly: false });

const productValidator = Joi.object({
  slug: Joi.string().required(),
  type: Joi.string().valid(ProductType.CPU, ProductType.GPU),
  name: Joi.string().required(),
  specs: Joi.array().items(productSpecValidator),
  benchmarks: Joi.array().items(productBenchmarkValidator),
}).options({ abortEarly: false });

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getProductBySlug(slug: string) {
    return await this.productRepository.findBySlug(slug);
  }
}
