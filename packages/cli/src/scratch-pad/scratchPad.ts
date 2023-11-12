import { BenchmarkKey, ProductSourceKey } from '@pcpartdb/shared';
import { getDatabase } from '../shared/database';

export async function scratchPad() {
  const db = await getDatabase();

  // Delete UL Benchmark product sources
  await db.productSource.deleteMany({
    where: { sourceKey: ProductSourceKey.UlBenchmarks },
  });

  // Delete UL Benchmark automation sources
  await db.automationSource.deleteMany({
    where: { sourceKey: ProductSourceKey.UlBenchmarks },
  });

  await db.productBenchmark.updateMany({
    where: { benchmarkKey: BenchmarkKey.GeekBench_Multi_Core },
    data: { benchmarkKey: BenchmarkKey.Geekbench_6_2_Multi_Core },
  });

  await db.productBenchmark.updateMany({
    where: { benchmarkKey: BenchmarkKey.GeekBench_Single_Core },
    data: { benchmarkKey: BenchmarkKey.Geekbench_6_2_Single_Core },
  });
}
