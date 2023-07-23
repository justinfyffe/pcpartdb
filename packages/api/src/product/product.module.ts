import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { CpuModule } from './cpu/cpu.module';
import { GpuModule } from './gpu/gpu.module';
import { ProductSourceController } from './product-source.controller';
import { ProductSourceRepository } from './product-source.repository';
import { ProductSourceService } from './product-source.service';
import { ProductUpdateRepository } from './product-update.repository';
import { ProductUpdateService } from './product-update.service';

@Module({
  imports: [DatabaseModule, CpuModule, GpuModule],
  controllers: [ProductSourceController],
  providers: [
    ProductSourceRepository,
    ProductSourceService,
    ProductUpdateRepository,
    ProductUpdateService,
  ],
  exports: [
    ProductSourceRepository,
    ProductSourceService,
    ProductUpdateRepository,
    ProductUpdateService,
  ],
})
export class ProductModule {}
