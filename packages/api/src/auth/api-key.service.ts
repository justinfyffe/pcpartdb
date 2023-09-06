import { Injectable } from '@nestjs/common';
import { mapToApiKeyDto } from '@pcpartdb/database';
import { Context } from '../shared/context';
import { generateToken } from '../shared/crypto/utils';
import { forbiddenError } from '../shared/error';
import { ApiKeyRepository } from './api-key.repository';

const API_KEY_SIZE = 32;

@Injectable()
export class ApiKeyService {
  constructor(private apiKeyRepository: ApiKeyRepository) {}

  async findForCurrentUser(ctx: Context) {
    const user = ctx.user;
    if (user == null) {
      throw forbiddenError();
    }

    const entity = await this.apiKeyRepository.findByUserId(user.id, ctx);
    return mapToApiKeyDto(entity);
  }

  async refresh(ctx: Context) {
    const user = ctx.user;
    if (user == null) {
      throw forbiddenError();
    }

    const token = generateToken(API_KEY_SIZE);
    const entity = await this.apiKeyRepository.refresh(
      { apiKey: token, userId: user.id },
      ctx,
    );
    return mapToApiKeyDto(entity);
  }

  async delete(ctx: Context) {
    const user = ctx.user;
    if (user == null) {
      throw forbiddenError();
    }

    await this.apiKeyRepository.deleteByUserId(user.id, ctx);
  }
}
