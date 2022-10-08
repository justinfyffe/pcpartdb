import { Module } from '@nestjs/common';
import { ProductBenchmarkRepository } from './benchmark/product-benchmark.repository';
import { ProductImageRepository } from './image/product-image.repository';
import { ProductMetaController } from './meta/product-meta.controller';
import { ProductMetaRepository } from './meta/product-meta.repository';
import { ProductMetaService } from './meta/product-meta.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductReviewRepository } from './review/product-review.repository';
import { ProductSpecController } from './spec/product-spec.controller';
import { ProductSpecRepository } from './spec/product-spec.repository';
import { ProductSpecService } from './spec/product-spec.service';

@Module({
  controllers: [
    ProductController,
    ProductMetaController,
    ProductSpecController,
  ],
  providers: [
    ProductService,
    ProductMetaService,
    ProductSpecService,
    ProductRepository,
    ProductImageRepository,
    ProductMetaRepository,
    ProductSpecRepository,
    ProductBenchmarkRepository,
    ProductReviewRepository,
  ],
})
export class ProductModule {}
