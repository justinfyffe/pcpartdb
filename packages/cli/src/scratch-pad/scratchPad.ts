import { BenchmarkKey } from '@pcpartdb/shared';
import { getDatabase } from '../shared/database';

export async function scratchPad() {
  const db = await getDatabase();

  // Update old benchmarks
  console.log('Update CPU Mark Single Thread');
  await db.productBenchmark.updateMany({
    where: { benchmarkKey: BenchmarkKey.CpuMark_Single_Thread },
    data: { benchmarkKey: BenchmarkKey.PassMark_CpuMark_Single_Thread },
  });
  console.log('Update CPU Mark Multi Thread');
  await db.productBenchmark.updateMany({
    where: { benchmarkKey: BenchmarkKey.CpuMark_Multi_Thread },
    data: { benchmarkKey: BenchmarkKey.PassMark_CpuMark_Multi_Thread },
  });
  console.log('Update G2D Mark');
  await db.productBenchmark.updateMany({
    where: { benchmarkKey: BenchmarkKey.G2dMark },
    data: { benchmarkKey: BenchmarkKey.PassMark_G2dMark },
  });
  console.log('Update G3D Mark');
  await db.productBenchmark.updateMany({
    where: { benchmarkKey: BenchmarkKey.G3dMark },
    data: { benchmarkKey: BenchmarkKey.PassMark_G3dMark },
  });
  console.log('Update Time Spy');
  await db.productBenchmark.updateMany({
    where: { benchmarkKey: BenchmarkKey.Timespy_Graphics },
    data: { benchmarkKey: BenchmarkKey._3dMark_Timespy_Graphics },
  });

  // Update benchmark per msrp
  console.log('Performance per msrp');
  const products = await db.product.findMany({
    include: { cpuFields: true, gpuFields: true, benchmarks: true },
  });

  for (const product of products) {
    const msrp = product.cpuFields?.msrpValue ?? product.gpuFields?.msrpValue;

    if (msrp != null && msrp > 0) {
      for (const benchmark of product.benchmarks ?? []) {
        const perMsrp = benchmark.value / msrp;
        benchmark.valuePerMsrp = perMsrp;
        await db.productBenchmark.update({
          data: benchmark,
          where: {
            productId_benchmarkKey: {
              productId: benchmark.productId,
              benchmarkKey: benchmark.benchmarkKey,
            },
          },
        });
      }
    }
  }
}
