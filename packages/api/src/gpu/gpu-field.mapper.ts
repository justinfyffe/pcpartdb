import { GpuField, GpuFieldMeta } from '@pcpartdb/shared';
import { GpuFieldsMetaJson } from './gpu.entity';

interface MapToDtoOptions {
  fields?: Set<string>;
  includeSources?: boolean;
}

export function mapToGpuFieldDto<
  TReturn,
  TEntity extends Record<string, unknown>,
>(
  entity: TEntity,
  key: keyof TEntity,
  options?: MapToDtoOptions,
): GpuField<TReturn> {
  if (entity[key as string] == null) {
    return null;
  }

  if (options?.fields != null && !options?.fields.has(String(key))) {
    return null;
  }

  const metadata = entity.metadata as GpuFieldsMetaJson;

  let meta: GpuFieldMeta;
  if (metadata?.fields?.[key as string] != null) {
    meta = metadata?.fields?.[key as string];
  }

  // Don't include sources unless explicitly specified
  if (meta != null && options?.includeSources !== true) {
    meta.dataSource = undefined;
  }

  return {
    value: entity[key as string] as TReturn,
    meta,
  };
}

export function mapToGpuFieldEntity<TReturn, TEntity>(
  fields: Partial<TEntity>,
  key: keyof TEntity,
  metadata: GpuFieldsMetaJson,
) {
  const field = fields?.[key] as GpuField<TReturn>;

  metadata.fields = metadata.fields ?? {};
  metadata.fields[key as string] = field?.meta ?? null;
  return field?.value ?? null;
}
