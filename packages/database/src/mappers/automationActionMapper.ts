import {
  AutomationAction,
  AutomationActionMeta,
  AutomationActionStatus,
  AutomationActionType,
} from '@pcpartdb/shared';
import { AutomationActionEntity } from '../automation';
import { gzipData, unzipData } from './utils';

interface MapToDtoOptions {
  includeData?: boolean;
}

export async function mapToAutomationActionDto<TUpdateData = unknown>(
  entity: AutomationActionEntity,
  options?: MapToDtoOptions,
): Promise<AutomationAction> {
  const includeData = options?.includeData ?? true;

  let data: TUpdateData = null;
  if (includeData) {
    data = await unzipData(entity.data);
  }

  return {
    id: entity.id,
    description: entity.description,
    status: entity.status as AutomationActionStatus,
    type: entity.type as AutomationActionType,
    data,
    metadata: entity.metadata as AutomationActionMeta,
    priority: entity.priority,
    timestamp: entity.timestamp.getTime(),
  };
}

interface MapToDtoOptions {
  includeData?: boolean;
}

export async function mapToAutomationActionDtos<TUpdateData = unknown>(
  entities: AutomationActionEntity[],
  options?: MapToDtoOptions,
) {
  const ret: AutomationAction[] = [];
  for (let i = 0; i < entities.length; ++i) {
    ret.push(await mapToAutomationActionDto<TUpdateData>(entities[i], options));
  }
  return ret;
}

export async function mapToAutomationActionEntity(
  dto: AutomationAction,
): Promise<AutomationActionEntity> {
  const data = await gzipData(dto.data);

  return {
    id: dto.id,
    description: dto.description,
    status: dto.status,
    type: dto.type,
    data,
    metadata: dto.metadata,
    priority: dto.priority || 0,
    timestamp: dto.timestamp != null ? new Date(dto.timestamp) : undefined,
  };
}
