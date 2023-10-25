import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { ProductModule } from '../product/product.module';
import { AutomationController } from './automation.controller';
import { AutomationRepository } from './automation.repository';
import { AutomationService } from './automation.service';
import { AutomationActionsController } from './automation-actions.controller';
import { AutomationActionsService } from './automation-actions.service';
import { AutomationSourceController } from './automation-source.controller';
import { AutomationSourceRepository } from './automation-source.repository';
import { AutomationSourceService } from './automation-source.service';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [
    AutomationController,
    AutomationActionsController,
    AutomationSourceController,
  ],
  providers: [
    AutomationSourceRepository,
    AutomationSourceService,
    AutomationService,
    AutomationActionsService,
    AutomationRepository,
  ],
  exports: [
    AutomationSourceRepository,
    AutomationSourceService,
    AutomationService,
    AutomationActionsService,
    AutomationRepository,
  ],
})
export class AutomationModule {}
