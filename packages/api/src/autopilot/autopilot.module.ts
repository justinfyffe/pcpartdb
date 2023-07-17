import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { AutopilotController } from './autopilot.controller';
import { AutopilotService } from './autopilot.service';
import { AutopilotApprovalsRepository } from './autopilot-approvals.repository';
import { AutopilotLogsRepository } from './autopilot-logs.repository';
import { AutopilotQueueRepository } from './autopilot-queue.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AutopilotController],
  providers: [
    AutopilotService,
    AutopilotApprovalsRepository,
    AutopilotLogsRepository,
    AutopilotQueueRepository,
  ],
  exports: [AutopilotService],
})
export class AutopilotModule {}
