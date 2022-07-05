import { Module } from '@nestjs/common';
import { AccessTokenController } from './access-token.controller';
import { AccessTokenService } from './access-token.service';
import { StaffGuard } from './staff.guard';
import { UserGuard } from './user.guard';

@Module({
  controllers: [AccessTokenController],
  providers: [AccessTokenService, UserGuard, StaffGuard],
  exports: [AccessTokenService, UserGuard, StaffGuard],
})
export class AuthModule {}
