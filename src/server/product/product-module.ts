import { Module } from '@nestjs/common';
import { BenchmarkRepository } from './benchmark/benchmark-repository';
import { ProductImageRepository } from './image/product-image-repository';
import { ProductMetaController } from './meta/product-meta-controller';
import { ProductMetaRepository } from './meta/product-meta-repository';
import { ProductMetaService } from './meta/product-meta-service';
import { ProductController } from './product-controller';
import { ProductRepository } from './product-repository';
import { ProductService } from './product-service';
import { ReviewRepository } from './review/review-repository';
import { SpecRepository } from './spec/spec-repository';
import { SpecService } from './spec/spec-service';
import { SpecController } from './spec/spec-controller';

@Module({
  controllers: [ProductController, ProductMetaController, SpecController],
  providers: [
    ProductService,
    ProductMetaService,
    SpecService,
    ProductRepository,
    ProductImageRepository,
    ProductMetaRepository,
    SpecRepository,
    BenchmarkRepository,
    ReviewRepository,
  ],
})
export class ProductModule {}
