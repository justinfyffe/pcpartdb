import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AccessTokenController } from './access-token.controller';
import { AccessTokenRepository } from './access-token.repository';
import { AccessTokenService } from './access-token.service';
import { StaffGuard } from './staff.guard';
import { UserGuard } from './user.guard';

@Global()
@Module({
  imports: [UserModule],
  controllers: [AccessTokenController],
  providers: [AccessTokenService, AccessTokenRepository, UserGuard, StaffGuard],
  exports: [AccessTokenService, AccessTokenRepository, UserGuard, StaffGuard],
})
export class AuthModule {}
