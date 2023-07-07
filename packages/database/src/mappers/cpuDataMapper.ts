import { CpuField, CpuFieldMeta } from '@pcpartdb/shared';
import { CpuDataMetaJson } from '../cpu';

interface MapToDtoOptions {
  fields?: Set<string>;
  includeSources?: boolean;
}

export function mapToCpuDataDto<
  TReturn,
  TEntity extends Record<string, unknown>,
>(
  entity: TEntity,
  key: keyof TEntity,
  options?: MapToDtoOptions,
): CpuField<TReturn> {
  if (options?.fields != null && !options?.fields.has(String(key))) {
    // Excluded from fields param, ignore this value.
    return undefined;
  }

  const metadata = entity.metadata as CpuDataMetaJson;

  let meta: CpuFieldMeta;
  if (metadata?.fields?.[key as string] != null) {
    meta = metadata?.fields?.[key as string];
  }

  // Don't include sources unless explicitly specified
  if (meta != null && options?.includeSources !== true) {
    meta.autoUpdate = undefined;
    meta.source = undefined;
  }

  const value = entity[key as string] as TReturn;
  if (meta == null && value == null) {
    // No value,
    return undefined;
  }

  return { value, meta };
}

export function mapToCpuDataEntity<TReturn, TEntity>(
  fields: Partial<TEntity>,
  key: keyof TEntity,
  metadata: CpuDataMetaJson,
) {
  const field = fields?.[key] as CpuField<TReturn>;
  if (field?.meta?.source != null) {
    delete field.meta.source;
  }

  metadata.fields = metadata.fields || {};
  metadata.fields[key as string] = field?.meta || null;
  return field?.value ?? null;
}
