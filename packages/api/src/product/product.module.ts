import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { AutomationSourceController } from './automation-source.controller';
import { AutomationSourceRepository } from './automation-source.repository';
import { AutomationSourceService } from './automation-source.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductAutocompleteRepository } from './product-autocomplete.repository';
import { ProductAutocompleteService } from './product-autocomplete.service';
import { ProductRanksRepository } from './product-ranks.repository';
import { ProductRanksService } from './product-ranks.service';
import { ProductUpdateController } from './product-update.controller';
import { ProductUpdateRepository } from './product-update.repository';
import { ProductUpdateService } from './product-update.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AutomationSourceController,
    ProductUpdateController,
    ProductController,
  ],
  providers: [
    AutomationSourceRepository, // TODO: move to automation folder
    AutomationSourceService, // TODO: move to automation folder
    ProductAutocompleteRepository,
    ProductAutocompleteService,
    ProductRanksRepository,
    ProductRanksService,
    ProductUpdateRepository,
    ProductUpdateService,
    ProductRepository,
    ProductService,
  ],
  exports: [
    AutomationSourceRepository, // TODO: move to automation folder
    AutomationSourceService, // TODO: move to automation folder
    ProductAutocompleteRepository,
    ProductAutocompleteService,
    ProductRanksRepository,
    ProductRanksService,
    ProductUpdateRepository,
    ProductUpdateService,
    ProductRepository,
    ProductService,
  ],
})
export class ProductModule {}
