import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { CpuModule } from '../product/cpu/cpu.module';
import { GpuModule } from '../product/gpu/gpu.module';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';

@Module({
  imports: [DatabaseModule, CpuModule, GpuModule],
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}
