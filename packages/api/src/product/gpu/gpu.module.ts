import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database';
import { ProductModule } from '../product.module';
import { GpuAutocompleteModule } from './autocomplete/gpu-autocomplete.module';
import { GpuBulkModule } from './bulk/gpu-bulk.module';
import { GpuController } from './gpu.controller';
import { GpuRepository } from './gpu.repository';
import { GpuService } from './gpu.service';
import { GpuRanksModule } from './ranks/gpu-ranks.module';
import { GpuScrapeModule } from './scrape/gpu-scrape.module';

@Module({
  imports: [
    DatabaseModule,
    GpuAutocompleteModule,
    GpuBulkModule,
    GpuRanksModule,
    GpuScrapeModule,
    forwardRef(() => ProductModule),
  ],
  controllers: [GpuController],
  providers: [GpuService, GpuRepository],
  exports: [GpuService, GpuRepository],
})
export class GpuModule {}
