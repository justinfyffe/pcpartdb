import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AutomationModule } from './automation/automation.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database';
import { ImageModule } from './image/image.module';
import { ProductModule } from './product/product.module';
import { CacheModule } from './shared/cache/cache.module';
import { createFileHashStore } from './shared/cache/file-hash-store';
import { ContextMiddleware } from './shared/context';
import { CookieModule } from './shared/cookie/cookie.module';
import { dataPath } from './shared/utils';
import { UserModule } from './user/user.module';
import { ViewModelsModule } from './view-models/view-models.module';
import { WebsiteModule } from './website/website.module';

@Module({
  imports: [
    NestCacheModule.register({
      store: createFileHashStore,
      path: dataPath('cache'),
      subDirs: true,
      zip: true,
      isGlobal: true,
    }),
    CacheModule,
    AuthModule,
    AutomationModule,
    ConfigModule,
    DatabaseModule,
    ImageModule,
    ProductModule,
    CookieModule,
    UserModule,
    WebsiteModule,
    ViewModelsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
