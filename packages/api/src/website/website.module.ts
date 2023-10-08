import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { ProductModule } from '../product/product.module';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}
