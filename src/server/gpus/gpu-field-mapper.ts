import { Prisma } from '@prisma/client';
import { GpuField, GpuFieldMeta } from '@shared/gpus';

export function mapToGpuFieldDto<
  TReturn,
  TEntity extends Record<string, unknown>,
>(entity: TEntity, key: keyof TEntity): GpuField<TReturn> {
  if (entity[key as string] == null) {
    return null;
  }

  const metadata = entity.metadata as Prisma.JsonObject;

  return {
    value: entity[key as string] as TReturn,
    meta: metadata?.[key] as Prisma.JsonObject,
  };
}

export function mapToGpuFieldEntity<TReturn, TEntity>(
  fields: Partial<TEntity>,
  key: keyof TEntity,
  metadata: { [col: string]: GpuFieldMeta },
) {
  const field = fields?.[key] as GpuField<TReturn>;

  metadata[key as string] = field?.meta ?? null;
  return field?.value ?? null;
}
