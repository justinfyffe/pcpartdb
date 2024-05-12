import {
  AutomationSource,
  ProductSourceKey,
  ProductType,
} from '@pcpartdb/shared';
import { AutomationSourceEntity } from '../automation';

export async function mapToAutomationSourceDto(
  row: AutomationSourceEntity,
): Promise<AutomationSource> {
  if (row == null) {
    return null;
  }

  const dto: AutomationSource = {
    id: row.id,
    groupKey: row.groupKey,
    productType: row.productType as ProductType,
    sourceKey: row.sourceKey as ProductSourceKey,
    externalKey: row.externalKey,
    sourceName: row.sourceName,
    sourceUrl: row.sourceUrl,
    archived: row.archived,
  };

  return dto as AutomationSource;
}

export async function mapToAutomationSourceDtos(
  entities: AutomationSourceEntity[],
) {
  if (entities == null) {
    return null;
  }

  const promises = entities.map((entity) => mapToAutomationSourceDto(entity));
  return await Promise.all(promises);
}

export function mapToAutomationSourceEntity(
  automationSource: Partial<AutomationSource>,
): AutomationSourceEntity {
  if (automationSource == null) {
    return null;
  }

  return {
    id: undefined,
    groupKey: automationSource.groupKey,
    productType: automationSource.productType,
    sourceKey: automationSource.sourceKey,
    externalKey: automationSource.externalKey,
    sourceName: automationSource.sourceName,
    sourceUrl: automationSource.sourceUrl,
    archived: automationSource.archived,

    createdAt: undefined,
    updatedAt: undefined,
  };
}
