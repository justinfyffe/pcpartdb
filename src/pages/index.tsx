import { HomePage, HomePageProps } from '@client/home/pages';
import { partService } from '@server/part/part-service';
import { filterParts, sortParts } from '@server/part/part-utils';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';
import { serialize } from '@server/shared/types/serialize';
import { Part, PartComparison, PartSort, PartType } from '@shared/part';

export const getServerSideProps = ssrPageProps<HomePageProps>(
  async (ctx: SsrContext) => {
    const gpus = await getAllGpus(ctx);
    const nvidiaGpus = getNvidiaGpus(gpus);
    const amdGpus = getAmdGpus(gpus);

    const nvidiaVsAmdGpus = [
      [nvidiaGpus[0], amdGpus[0]],
      [nvidiaGpus[1], amdGpus[1]],
      [nvidiaGpus[2], amdGpus[2]],
    ].filter(([p1, p2]) => p1 != null && p2 != null) as PartComparison[];

    return { nvidiaVsAmdGpus, nvidiaGpus, amdGpus };
  },
);

async function getAllGpus(ctx: Context) {
  const gpus = await partService.list(
    { type: PartType.GPU, includeImages: true },
    ctx,
  );
  return serialize(gpus) as Part[];
}

function getNvidiaGpus(gpus: Part[]) {
  const nvidiaGpus = filterParts(gpus, { company: ['nvidia'] });

  const bestPerformingGpus =
    sortParts(nvidiaGpus, {
      sort: PartSort.PerformanceRating,
    }) ?? [];

  const bestValueGpus =
    sortParts(nvidiaGpus, {
      sort: PartSort.ValueRating,
    }) ?? [];

  const bestPerformingGpu = bestPerformingGpus[0] || null;
  const bestValueGpu = bestValueGpus[0] || null;

  const randomGpu =
    bestPerformingGpus[
      Math.floor(Math.random() * Math.min(nvidiaGpus.length - 1, 15))
    ];
  return [bestPerformingGpu, bestValueGpu, randomGpu];
}

function getAmdGpus(gpus: Part[]) {
  const amdGpus = filterParts(gpus, { company: ['amd'] });

  const bestPerformingGpus =
    sortParts(amdGpus, {
      sort: PartSort.PerformanceRating,
    }) ?? [];

  const bestValueGpus =
    sortParts(amdGpus, {
      sort: PartSort.ValueRating,
    }) ?? [];

  const bestPerformingGpu = bestPerformingGpus[0] || null;
  const bestValueGpu = bestValueGpus[0] || null;

  const randomGpu =
    bestPerformingGpus[
      Math.floor(Math.random() * Math.min(amdGpus.length - 1, 15))
    ];
  return [bestPerformingGpu, bestValueGpu, randomGpu];
}

export default HomePage;
