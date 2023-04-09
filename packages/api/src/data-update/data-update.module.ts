import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { GpuModule } from '../gpu/gpu.module';
import { DataUpdateController } from './data-update.controller';
import { DataUpdateRepository } from './data-update.repository';
import { DataUpdateService } from './data-update.service';

@Module({
  imports: [DatabaseModule, GpuModule],
  controllers: [DataUpdateController],
  providers: [DataUpdateService, DataUpdateRepository],
  exports: [DataUpdateService],
})
export class DataUpdateModule {}
