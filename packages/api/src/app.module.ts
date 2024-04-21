import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AutomationModule } from './automation/automation.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database';
import { GameModule } from './game/game.module';
import { ImageModule } from './image/image.module';
import { ProductModule } from './product/product.module';
import { CacheModule } from './shared/cache/cache.module';
import { ContextMiddleware } from './shared/context';
import { CookieModule } from './shared/cookie/cookie.module';
import { UserModule } from './user/user.module';
import { ViewModelsModule } from './view-models/view-models.module';
import { WebsiteModule } from './website/website.module';

@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true,
      max: process.env.CACHE_SIZE ? Number(process.env.CACHE_SIZE) : 1_000,
    }),
    CacheModule,
    AuthModule,
    AutomationModule,
    ConfigModule,
    DatabaseModule,
    GameModule,
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
