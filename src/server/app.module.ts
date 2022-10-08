import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { HomeModule } from './home/home.module';
import { ImageModule } from './images/image.module';
import { ProductModule } from './product/product.module';
import { SharedModule } from './shared/shared.module';
import { UserMiddleware } from './user/user.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DbModule.register(),
    AuthModule,
    HomeModule,
    ImageModule,
    ProductModule,
    SharedModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
