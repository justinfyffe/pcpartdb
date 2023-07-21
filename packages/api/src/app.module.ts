import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database';
import { ImageModule } from './image/image.module';
import { CpuModule } from './product/cpu/cpu.module';
import { GpuModule } from './product/gpu/gpu.module';
import { ProductModule } from './product/product.module';
import { ContextMiddleware } from './shared/context';
import { CookieModule } from './shared/cookie';
import { UserModule } from './user/user.module';
import { ViewModelsModule } from './view-models/view-models.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    DatabaseModule,
    ImageModule,
    ProductModule,
    CpuModule,
    GpuModule,
    CookieModule,
    UserModule,
    ViewModelsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
