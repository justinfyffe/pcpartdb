import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
import { AutomationQueueRepository } from './automation-queue.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AutomationController],
  providers: [AutomationService, AutomationQueueRepository],
  exports: [AutomationService],
})
export class AutomationModule {}
