import { GpuField, GpuFieldMeta } from '@pcpartdb/shared';
import { GpuDataMetaJson } from '../gpu';

interface MapToDtoOptions {
  fields?: Set<string>;
  includeSources?: boolean;
}

export function mapToGpuDataDto<
  TReturn,
  TEntity extends Record<string, unknown>,
>(
  entity: TEntity,
  key: keyof TEntity,
  options?: MapToDtoOptions,
): GpuField<TReturn> {
  if (options?.fields != null && !options?.fields.has(String(key))) {
    // Excluded from fields param, ignore this value.
    return undefined;
  }

  const metadata = entity.metadata as GpuDataMetaJson;

  let meta: GpuFieldMeta;
  if (metadata?.fields?.[key as string] != null) {
    meta = metadata?.fields?.[key as string];
  }

  // Don't include sources unless explicitly specified
  if (meta != null && options?.includeSources !== true) {
    meta.autoUpdate = undefined;
    meta.source = undefined;
  }

  const value = entity[key as string] as TReturn;
  if (meta == null && (value == null || value === '')) {
    // No value, and no meta. Just skip it.
    return undefined;
  }

  return {
    value: entity[key as string] as TReturn,
    meta,
  };
}

export function mapToGpuDataEntity<TReturn, TEntity>(
  fields: Partial<TEntity>,
  key: keyof TEntity,
  metadata: GpuDataMetaJson,
) {
  const field = fields?.[key] as GpuField<TReturn>;
  if (field?.meta?.source != null) {
    delete field.meta.source;
  }

  metadata.fields = metadata.fields || {};
  metadata.fields[key as string] = field?.meta || null;
  return field?.value ?? null;
}
