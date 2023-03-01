import { HomePage, HomePageProps } from '@pcpartdb/website/client/home/pages';
import { gpuService } from '@pcpartdb/website/server/gpus/gpu-service';
import { Context } from '@pcpartdb/website/server/shared/context';
import { SsrContext } from '@pcpartdb/website/server/shared/ssr/context';
import { ssrPageProps } from '@pcpartdb/website/server/shared/ssr/props';
import { GpuComparison, GpuSort } from '@pcpartdb/website/shared/gpus';

export const getServerSideProps = ssrPageProps<HomePageProps>(
  async (ctx: SsrContext) => {
    const nvidiaGpus = await getNvidiaGpus(ctx);
    const amdGpus = await getAmdGpus(ctx);

    const nvidiaVsAmdGpus = [
      [nvidiaGpus[0], amdGpus[0]],
      [nvidiaGpus[1], amdGpus[1]],
      [nvidiaGpus[2], amdGpus[2]],
    ].filter(([p1, p2]) => p1 != null && p2 != null) as GpuComparison[];

    return { nvidiaVsAmdGpus, nvidiaGpus, amdGpus };
  },
);

async function getNvidiaGpus(ctx: Context) {
  const bestPerformance =
    (
      await gpuService.list(
        {
          query: {
            filter: { performanceRated: true, company: ['nvidia'] },
            orderBy: { sort: GpuSort.PerformanceRating },
            limit: 1,
          },
          includeImages: true,
        },
        ctx,
      )
    )[0] || null;

  const bestValueResults = await gpuService.list(
    {
      query: {
        filter: { performanceRated: true, company: ['nvidia'] },
        orderBy: { sort: GpuSort.ValueRating },
        limit: 3,
      },
      includeImages: true,
    },
    ctx,
  );
  const bestValue1 = bestValueResults[0] || null;
  const bestValue3 = bestValueResults[2] || null;

  return [bestPerformance, bestValue1, bestValue3];
}

async function getAmdGpus(ctx: Context) {
  const bestPerformance =
    (
      await gpuService.list(
        {
          query: {
            filter: { performanceRated: true, company: ['amd'] },
            orderBy: { sort: GpuSort.PerformanceRating },
            limit: 1,
          },
          includeImages: true,
        },
        ctx,
      )
    )[0] || null;

  const bestValueResults = await gpuService.list(
    {
      query: {
        filter: { performanceRated: true, company: ['amd'] },
        orderBy: { sort: GpuSort.ValueRating },
        limit: 3,
      },
      includeImages: true,
    },
    ctx,
  );
  const bestValue1 = bestValueResults[0] || null;
  const bestValue3 = bestValueResults[2] || null;

  return [bestPerformance, bestValue1, bestValue3];
}

export default HomePage;
