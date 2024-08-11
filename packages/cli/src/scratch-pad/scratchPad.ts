import {
  GpuFieldsEntity,
  mapToProductFieldsDto,
  mapToProductFieldsEntity,
  ProductFieldsEntity,
  ProductFieldsRepository,
  ProductRepository,
} from '@pcpartdb/database';
import { GpuFields, ProductType } from '@pcpartdb/shared';
import { getDatabase } from '../shared/database';

export async function scratchPad() {
  const db = await getDatabase();
  const productRepository = new ProductRepository(db);
  const fieldRepository = new ProductFieldsRepository(db);

  const gpuIds = await productRepository.list2({
    filter: {
      productType: ProductType.Gpu,
      company: ['AMD'],
    },
  });

  const entities = (await fieldRepository.findByProductIds({
    productIds: gpuIds,
  })) as GpuFieldsEntity[];

  for (const entity of entities) {
    const dto: GpuFields = mapToProductFieldsDto(ProductType.Gpu, entity, {
      includeAutomation: true,
    });

    // Tensor Cores -> AI Accelerators
    dto.aiAccelerators = dto.tensorCores;
    if (dto.aiAccelerators && dto.aiAccelerators.meta) {
      dto.aiAccelerators.meta.fieldKey = 'aiAccelerators';
    }
    dto.tensorCores = null;

    // RT Cores -> Ray Accelerators
    dto.rayAccelerators = dto.rtCores;
    if (dto.rayAccelerators && dto.rayAccelerators.meta) {
      dto.rayAccelerators.meta.fieldKey = 'rayAccelerators';
    }
    dto.rtCores = null;

    const updatedEntity = mapToProductFieldsEntity(ProductType.Gpu, dto);
    await db.gpuFields.update({
      data: updatedEntity,
      where: { productId: dto.productId },
    });
  }
}
