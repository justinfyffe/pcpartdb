import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserMiddleware } from './user.middleware';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserMiddleware, UserService, UserRepository],
  exports: [UserMiddleware, UserService, UserRepository],
})
export class UserModule {}
