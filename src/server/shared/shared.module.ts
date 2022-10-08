import { Global, Module } from '@nestjs/common';
import { CookieService } from './cookie/cookie.service';

@Global()
@Module({
  providers: [CookieService],
  exports: [CookieService],
})
export class SharedModule {}
