import {
  CpuFieldsEntity,
  GpuFieldsEntity,
  mapToProductDtos,
  mapToProductEntity,
  mapToProductFieldsDto,
  mapToProductFieldsEntity,
  ProductFieldsRepository,
  ProductRepository,
} from '@pcpartdb/database';
import {
  ArrayMerge,
  CanMergeAutoUpdateStrategy,
  CanMergeNoEmptyStrategy,
  CpuFields,
  createEmptyCpuFields,
  createEmptyCpuProduct,
  createEmptyGpuFields,
  createEmptyGpuProduct,
  deepmerge,
  GpuFields,
  GpuProduct,
  mergeProducts,
  ProductType,
} from '@pcpartdb/shared';
import { getDatabase } from '../shared/database';

export async function scratchPad() {
  await updateGpus();
  await updateCpus();
}

async function updateGpus() {
  const db = await getDatabase();
  const productRepository = new ProductRepository(db);
  const fieldRepository = new ProductFieldsRepository(db);

  const gpuIds = await productRepository.list2({
    filter: {
      productType: ProductType.Gpu,
    },
  });
  const entities = (await fieldRepository.findByProductIds({
    productIds: gpuIds,
  })) as GpuFieldsEntity[];

  for (const entity of entities) {
    const dto = mapToProductFieldsDto(ProductType.Gpu, entity, {
      includeAutomation: true,
    });
    const merged = deepmerge(
      {
        arrayMerge: ArrayMerge.Combine,
        canMergeStrategy: CanMergeNoEmptyStrategy,
      },
      createEmptyGpuFields(),
      dto,
    );
    const updatedEntity = mapToProductFieldsEntity(ProductType.Gpu, merged);
    await db.gpuFields.update({
      data: updatedEntity,
      where: { productId: dto.productId },
    });
  }
}

async function updateCpus() {
  const db = await getDatabase();
  const productRepository = new ProductRepository(db);
  const fieldRepository = new ProductFieldsRepository(db);

  const cpuIds = await productRepository.list2({
    filter: {
      productType: ProductType.Cpu,
    },
  });
  const entities = (await fieldRepository.findByProductIds({
    productIds: cpuIds,
  })) as CpuFieldsEntity[];

  for (const entity of entities) {
    const dto = mapToProductFieldsDto(ProductType.Cpu, entity, {
      includeAutomation: true,
    });
    const merged = deepmerge(
      {
        arrayMerge: ArrayMerge.Combine,
        canMergeStrategy: CanMergeNoEmptyStrategy,
      },
      createEmptyCpuFields(),
      dto,
    );
    const updatedEntity = mapToProductFieldsEntity(ProductType.Cpu, merged);
    await db.cpuFields.update({
      data: updatedEntity,
      where: { productId: dto.productId },
    });
  }
}
