import { Injectable } from '@nestjs/common';
import { AdminEditGameViewModel } from '@pcpartdb/shared';
import { GameService } from 'packages/api/src/game/game.service';
import { Context } from 'packages/api/src/shared/context';

@Injectable()
export class AdminEditGameViewModelService {
  constructor(private gameService: GameService) {}

  async viewModel(gameIdOrSlug: string, ctx: Context) {
    const game = await this.getGame(gameIdOrSlug, ctx);
    return {
      game,
    } as AdminEditGameViewModel;
  }

  private async getGame(gameIdOrSlug: string, ctx: Context) {
    const id = Number(gameIdOrSlug);
    if (isNaN(id)) {
      return await this.getGameBySlug(gameIdOrSlug, ctx);
    } else {
      return await this.getGameById(id, ctx);
    }
  }

  private async getGameById(id: number, ctx: Context) {
    return await this.gameService.getById(
      {
        id,
        includeScraperOptions: true,
        includeListingImage: true,
        includeRequirements: true,
      },
      ctx,
    );
  }

  private async getGameBySlug(slug: string, ctx: Context) {
    return await this.gameService.getBySlug(
      {
        slug,
        includeScraperOptions: true,
        includeListingImage: true,
        includeRequirements: true,
      },
      ctx,
    );
  }
}
