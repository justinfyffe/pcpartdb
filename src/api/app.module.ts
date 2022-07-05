import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { HomeModule } from './home/home.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [DbModule.register(), HomeModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
