import { ProductRepository } from '@pcpartdb/database';
import { BenchmarKey, ProductType } from '@pcpartdb/shared';
import { getDatabase } from '../shared/database';

export async function scratchPad() {
  const db = await getDatabase();
  const productRepository = new ProductRepository(db);

  const weights = {
    [BenchmarKey.G3dMark]: 0.9,
    [BenchmarKey.G2dMark]: 0.1,
  };

  const gpus = await productRepository.list({
    productType: ProductType.Gpu,
    filter: { isChipset: true },
    includeBenchmarks: true,
  });

  const data = gpus.map((gpu) => ({
    name: gpu.name,
    score: null,
    benchmarks: gpu.benchmarks.reduce((acc, benchmark) => {
      acc[benchmark.benchmarkKey] = benchmark.value;
      return acc;
    }, {} as Record<string, number>),
  }));

  const maxes: Record<string, number> = {};
}
