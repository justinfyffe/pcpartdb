import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { GameModule } from '../game/game.module';
import { CacheModule } from '../shared/cache/cache.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductAutocompleteService } from './product-autocomplete.service';
import { ProductEntityCache } from './product-entity.cache';
import { ProductUpdateController } from './product-update.controller';
import { ProductUpdateService } from './product-update.service';
import { RelativeDataProductsService } from './relative-data-products.service';
import {
  ProductAutocompleteRepository,
  ProductBenchmarkRepository,
  ProductFieldsRepository,
  ProductGameFpsRepository,
  ProductImageRepository,
  ProductRanksRepository,
  ProductRepository,
  ProductSourceRepository,
  ProductUpdateRepository,
  RelatedProductRepository,
} from './repositories';

@Module({
  imports: [CacheModule, DatabaseModule, forwardRef(() => GameModule)],
  controllers: [ProductUpdateController, ProductController],
  providers: [
    ProductEntityCache,

    ProductRepository,
    ProductFieldsRepository,
    ProductBenchmarkRepository,
    ProductGameFpsRepository,
    ProductRanksRepository,
    ProductImageRepository,
    ProductSourceRepository,
    RelatedProductRepository,
    ProductAutocompleteRepository,
    ProductUpdateRepository,

    ProductAutocompleteService,
    ProductUpdateService,
    ProductService,
    RelativeDataProductsService,
  ],
  exports: [
    ProductEntityCache,

    ProductRepository,
    ProductFieldsRepository,
    ProductBenchmarkRepository,
    ProductGameFpsRepository,
    ProductRanksRepository,
    ProductImageRepository,
    ProductSourceRepository,
    RelatedProductRepository,
    ProductAutocompleteRepository,
    ProductUpdateRepository,

    ProductAutocompleteService,
    ProductUpdateService,
    ProductService,
    RelativeDataProductsService,
  ],
})
export class ProductModule {}
