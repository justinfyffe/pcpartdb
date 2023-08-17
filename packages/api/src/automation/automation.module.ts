import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { CpuModule } from '../product/cpu/cpu.module';
import { GpuModule } from '../product/gpu/gpu.module';
import { ProductModule } from '../product/product.module';
import { AutomationController } from './automation.controller';
import { AutomationRepository } from './automation.repository';
import { AutomationService } from './automation.service';

@Module({
  imports: [DatabaseModule, ProductModule, CpuModule, GpuModule],
  controllers: [AutomationController],
  providers: [AutomationService, AutomationRepository],
  exports: [AutomationService, AutomationRepository],
})
export class AutomationModule {}
