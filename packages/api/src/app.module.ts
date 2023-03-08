import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database';
import { GpuModule } from './gpu/gpu.module';
import { ImageModule } from './image/image.module';
import { ContextMiddleware } from './shared/context';
import { CookieModule } from './shared/cookie';
import { UserModule } from './user/user.module';
import { ViewModelsModule } from './view-models/view-models.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    DatabaseModule,
    GpuModule,
    ImageModule,
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
