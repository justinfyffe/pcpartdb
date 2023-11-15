import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductAutocompleteRepository } from './product-autocomplete.repository';
import { ProductAutocompleteService } from './product-autocomplete.service';
import { ProductUpdateController } from './product-update.controller';
import { ProductUpdateRepository } from './product-update.repository';
import { ProductUpdateService } from './product-update.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductUpdateController, ProductController],
  providers: [
    ProductAutocompleteRepository,
    ProductAutocompleteService,
    ProductUpdateRepository,
    ProductUpdateService,
    ProductRepository,
    ProductService,
  ],
  exports: [
    ProductAutocompleteRepository,
    ProductAutocompleteService,
    ProductUpdateRepository,
    ProductUpdateService,
    ProductRepository,
    ProductService,
  ],
})
export class ProductModule {}
