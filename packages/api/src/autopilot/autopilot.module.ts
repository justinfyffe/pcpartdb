import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { AutopilotController } from './autopilot.controller';
import { AutopilotService } from './autopilot.service';
import { AutopilotApprovalRepository } from './autopilot-approval.repository';
import { AutopilotLogRepository } from './autopilot-log.repository';
import { AutopilotQueueRepository } from './autopilot-queue.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AutopilotController],
  providers: [
    AutopilotService,
    AutopilotApprovalRepository,
    AutopilotLogRepository,
    AutopilotQueueRepository,
  ],
  exports: [AutopilotService],
})
export class AutopilotModule {}
