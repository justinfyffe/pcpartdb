import { Context } from '@server/shared/context';
import { SpecKey } from '@shared/spec';
import { specRepository } from './spec-repository';

export class SpecService {
  async autocomplete(key: SpecKey, value: string, ctx: Context) {
    return await specRepository.findSimilarValue(key, value, ctx);
  }
}

export const specService = new SpecService();
