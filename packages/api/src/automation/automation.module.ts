import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { ProductModule } from '../product/product.module';
import { AutomationController } from './automation.controller';
import { AutomationRepository } from './automation.repository';
import { AutomationService } from './automation.service';
import { AutomationActionsController } from './automation-actions.controller';
import { AutomationActionsService } from './automation-actions.service';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [AutomationController, AutomationActionsController],
  providers: [
    AutomationService,
    AutomationActionsService,
    AutomationRepository,
  ],
  exports: [AutomationService, AutomationActionsService, AutomationRepository],
})
export class AutomationModule {}
