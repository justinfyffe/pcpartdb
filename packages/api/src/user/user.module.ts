import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database';
import { CookieModule } from '../shared/cookie/cookie.module';
import { ViewModelsModule } from '../view-models/view-models.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),
    CookieModule,
    forwardRef(() => ViewModelsModule),
  ],
  controllers: [UserController, UserSettingsController],
  providers: [UserRepository, UserService, UserSettingsService],
  exports: [UserRepository, UserService, UserSettingsService],
})
export class UserModule {}
