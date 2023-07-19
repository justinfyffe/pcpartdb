import {
  AutomationQueueAction,
  AutomationQueueItem,
  AutomationQueueItemMeta,
  AutomationQueueStatus,
} from '@pcpartdb/shared';
import { AutomationQueueItemEntity } from '../automation';
import { gzipData, unzipData } from './utils';

interface MapToDtoOptions {
  includeData?: boolean;
}

export async function mapToAutomationQueueItemDto<TUpdateData = unknown>(
  entity: AutomationQueueItemEntity,
  options?: MapToDtoOptions,
): Promise<AutomationQueueItem> {
  const includeData = options?.includeData ?? true;

  let data: TUpdateData = null;
  if (includeData) {
    data = await unzipData(entity.data);
  }

  return {
    id: entity.id,
    description: entity.description,
    status: entity.status as AutomationQueueStatus,
    action: entity.action as AutomationQueueAction,
    data,
    metadata: entity.metadata as AutomationQueueItemMeta,
    priority: entity.priority,
    timestamp: entity.timestamp.getTime(),
    statusUpdatedAt: entity.statusUpdatedAt?.getTime() || null,
  };
}

interface MapToDtoOptions {
  includeData?: boolean;
}

export async function mapToAutomationQueueItemDtos<TUpdateData = unknown>(
  entities: AutomationQueueItemEntity[],
  options?: MapToDtoOptions,
) {
  const ret: AutomationQueueItem[] = [];
  for (let i = 0; i < entities.length; ++i) {
    ret.push(
      await mapToAutomationQueueItemDto<TUpdateData>(entities[i], options),
    );
  }
  return ret;
}

export async function mapToAutomationQueueItemEntity(
  dto: AutomationQueueItem,
): Promise<AutomationQueueItemEntity> {
  const data = await gzipData(dto.data);

  return {
    id: dto.id,
    description: dto.description,
    status: dto.status,
    action: dto.action,
    data,
    metadata: dto.metadata,
    priority: dto.priority,
    timestamp: dto.timestamp != null ? new Date(dto.timestamp) : null,
    statusUpdatedAt:
      dto.statusUpdatedAt != null ? new Date(dto.statusUpdatedAt) : null,
  };
}
