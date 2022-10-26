import { Injectable } from '@nestjs/common';
import { ServiceContext } from '@server/shared/service/context';
import { SpecKey } from '@shared/spec';
import { SpecRepository } from './spec-repository';

@Injectable()
export class SpecService {
  constructor(private specRepository: SpecRepository) {}

  async autocomplete(key: SpecKey, value: string, ctx: ServiceContext) {
    return await this.specRepository.findSimilarValue(key, value, ctx);
  }
}
