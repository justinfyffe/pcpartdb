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
      company: ['Intel'],
    },
  });

  const entities = (await fieldRepository.findByProductIds({
    productIds: gpuIds,
  })) as GpuFieldsEntity[];

  for (const entity of entities) {
    const dto: GpuFields = mapToProductFieldsDto(ProductType.Gpu, entity, {
      includeAutomation: true,
    });

    // Tensor Cores -> Xe Matrix Extensions
    dto.xeMatrixExtensions = dto.tensorCores;
    if (dto.xeMatrixExtensions && dto.xeMatrixExtensions.meta) {
      dto.xeMatrixExtensions.meta.fieldKey = 'xeMatrixExtensions';
    }
    dto.tensorCores = null;

    // RT Cores -> Ray Tracing Units
    dto.rayTracingUnits = dto.rtCores;
    if (dto.rayTracingUnits && dto.rayTracingUnits.meta) {
      dto.rayTracingUnits.meta.fieldKey = 'rayTracingUnits';
    }
    dto.rtCores = null;

    const updatedEntity = mapToProductFieldsEntity(ProductType.Gpu, dto);
    await db.gpuFields.update({
      data: updatedEntity,
      where: { productId: dto.productId },
    });
  }
}
