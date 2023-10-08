import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { ProductModule } from '../product/product.module';
import { AutomationController } from './automation.controller';
import { AutomationRepository } from './automation.repository';
import { AutomationService } from './automation.service';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [AutomationController],
  providers: [AutomationService, AutomationRepository],
  exports: [AutomationService, AutomationRepository],
})
export class AutomationModule {}
