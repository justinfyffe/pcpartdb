import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database';
import { ProductModule } from '../product.module';
import { CpuAutocompleteModule } from './autocomplete/cpu-autocomplete.module';
import { CpuBulkModule } from './bulk/cpu-bulk.module';
import { CpuController } from './cpu.controller';
import { CpuRepository } from './cpu.repository';
import { CpuService } from './cpu.service';
import { CpuRanksModule } from './ranks/cpu-ranks.module';
import { CpuScrapeModule } from './scrape/cpu-scrape.module';

@Module({
  imports: [
    DatabaseModule,
    CpuAutocompleteModule,
    CpuBulkModule,
    CpuRanksModule,
    CpuScrapeModule,
    forwardRef(() => ProductModule),
  ],
  controllers: [CpuController],
  providers: [CpuService, CpuRepository],
  exports: [CpuService, CpuRepository],
})
export class CpuModule {}
