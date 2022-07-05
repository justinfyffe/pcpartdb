import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { HomeModule } from './home/home.module';
import { ProductModule } from './product/product.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DbModule.register(),
    AuthModule,
    HomeModule,
    ProductModule,
    SharedModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
