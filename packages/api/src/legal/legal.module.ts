import { Module } from '@nestjs/common';
import { CookieModule } from '../shared/cookie/cookie.module';
import { LegalController } from './legal.controller';

@Module({
  imports: [CookieModule],
  controllers: [LegalController],
})
export class LegalModule {}
