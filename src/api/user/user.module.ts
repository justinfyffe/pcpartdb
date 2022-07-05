import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { UserController } from './user.controller';
import { UserMiddleware } from './user.middleware';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule, SharedModule],
  controllers: [UserController],
  providers: [UserMiddleware, UserService],
  exports: [UserMiddleware, UserService, UserRepository],
})
export class UserModule {}
