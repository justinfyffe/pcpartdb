import { ServiceContext } from '@server/shared/service/context';
import { SpecKey } from '@shared/spec';
import { specRepository } from './spec-repository';

export class SpecService {
  async autocomplete(key: SpecKey, value: string, ctx: ServiceContext) {
    return await specRepository.findSimilarValue(key, value, ctx);
  }
}

export const specService = new SpecService();
