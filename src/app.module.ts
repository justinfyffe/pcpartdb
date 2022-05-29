import { Module } from '@nestjs/common';
import { DbModule } from './db';

@Module({
  imports: [DbModule.register()],
  controllers: [],
  providers: [],
})
export class AppModule {}
