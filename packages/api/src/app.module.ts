import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GpuModule } from './gpu/gpu.module';
import { ImageModule } from './image/image.module';
import { ContextMiddleware } from './shared/context';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { ViewModelsModule } from './view-models/view-models.module';

@Module({
  imports: [
    AuthModule,
    GpuModule,
    ImageModule,
    SharedModule,
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
