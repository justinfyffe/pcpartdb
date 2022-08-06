import { Module } from '@nestjs/common';
import { ProductBenchmarkRepository } from './benchmark/product-benchmark.repository';
import { ProductMetaRepository } from './meta/product-meta.repository';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductSpecRepository } from './spec/product-spec.repository';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    ProductMetaRepository,
    ProductSpecRepository,
    ProductBenchmarkRepository,
  ],
})
export class ProductModule {}
