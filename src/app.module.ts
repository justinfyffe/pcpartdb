import { Module } from '@nestjs/common';
import { DbModule } from './db';
import { HomeModule } from './home/home.module';

@Module({
  imports: [DbModule.register(), HomeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
