import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { CookieModule } from '../shared/cookie';
import { UserModule } from '../user/user.module';
import { AccessTokenController } from './access-token.controller';
import { AccessTokenRepository } from './access-token.repository';
import { AccessTokenService } from './access-token.service';
import { ApiKeyRepository } from './api-key.repository';
import { ApiKeyService } from './api-key.service';
import { GuestGuard } from './guest.guard';
import { StaffGuard } from './staff.guard';
import { UserGuard } from './user.guard';

@Module({
  imports: [CookieModule, DatabaseModule, forwardRef(() => UserModule)],
  controllers: [AccessTokenController],
  providers: [
    AccessTokenService,
    AccessTokenRepository,
    ApiKeyService,
    ApiKeyRepository,
    GuestGuard,
    UserGuard,
    StaffGuard,
  ],
  exports: [
    AccessTokenService,
    AccessTokenRepository,
    ApiKeyService,
    ApiKeyRepository,
    GuestGuard,
    UserGuard,
    StaffGuard,
  ],
})
export class AuthModule {}
