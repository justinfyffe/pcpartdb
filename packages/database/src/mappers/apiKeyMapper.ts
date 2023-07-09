import { ApiKey } from '@pcpartdb/shared';
import { ApiKeyEntity } from '../api-key';
import { mapToUserDto } from './userMapper';

export function mapToApiKeyDto(entity: ApiKeyEntity): ApiKey {
  if (entity == null) {
    return null;
  }

  return {
    id: entity.id,
    apiKey: entity.apiKey,
    user: mapToUserDto(entity.user),
  };
}
