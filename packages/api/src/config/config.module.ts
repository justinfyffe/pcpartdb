import { Module } from '@nestjs/common';
import { CookieModule } from '../shared/cookie/cookie.module';
import { ConfigController } from './config.controller';

@Module({
  imports: [CookieModule],
  controllers: [ConfigController],
})
export class ConfigModule {}
