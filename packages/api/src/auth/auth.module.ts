import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { AccessTokenController } from './access-token.controller';
import { AccessTokenRepository } from './access-token.repository';
import { AccessTokenService } from './access-token.service';
import { GuestGuard } from './guest.guard';
import { StaffGuard } from './staff.guard';
import { UserGuard } from './user.guard';

@Module({
  imports: [SharedModule],
  controllers: [AccessTokenController],
  providers: [
    AccessTokenService,
    AccessTokenRepository,
    GuestGuard,
    UserGuard,
    StaffGuard,
  ],
  exports: [
    AccessTokenService,
    AccessTokenRepository,
    GuestGuard,
    UserGuard,
    StaffGuard,
  ],
})
export class AuthModule {}
