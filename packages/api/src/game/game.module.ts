import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { ProductModule } from '../product/product.module';
import { CacheModule } from '../shared/cache/cache.module';
import { GameController } from './game.controller';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { GameEntityCache } from './game-entity.cache';

@Module({
  imports: [DatabaseModule, CacheModule, forwardRef(() => ProductModule)],
  controllers: [GameController],
  providers: [GameEntityCache, GameService, GameRepository],
  exports: [GameEntityCache, GameService, GameRepository],
})
export class GameModule {}
