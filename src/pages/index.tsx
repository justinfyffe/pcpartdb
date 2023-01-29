import { HomePage, HomePageProps } from '@client/home/pages';
import { gpuService } from '@server/gpus/gpu-service';
import { Context } from '@server/shared/context';
import { SsrContext } from '@server/shared/ssr/context';
import { ssrPageProps } from '@server/shared/ssr/props';
import { Gpu, GpuComparison } from '@shared/gpus';

export const getServerSideProps = ssrPageProps<HomePageProps>(
  async (ctx: SsrContext) => {
    const gpus = await getAllGpus(ctx);
    const nvidiaGpus = getNvidiaGpus(gpus);
    const amdGpus = getAmdGpus(gpus);

    const nvidiaVsAmdGpus = [
      [nvidiaGpus[0], amdGpus[0]],
      [nvidiaGpus[1], amdGpus[1]],
      [nvidiaGpus[2], amdGpus[2]],
    ].filter(([p1, p2]) => p1 != null && p2 != null) as GpuComparison[];

    return { nvidiaVsAmdGpus, nvidiaGpus, amdGpus };
  },
);

async function getAllGpus(ctx: Context) {
  return await gpuService.list({ includeImages: true }, ctx);
}

function getNvidiaGpus(gpus: Gpu[]) {
  const nvidiaGpus = gpus;

  const bestPerformingGpus = nvidiaGpus;

  const bestValueGpus = nvidiaGpus;

  const bestPerformingGpu = bestPerformingGpus[0] || null;
  const bestValueGpu = bestValueGpus[0] || null;

  const randomGpu =
    bestPerformingGpus[
      Math.floor(Math.random() * Math.min(nvidiaGpus.length - 1, 15))
    ];
  return [bestPerformingGpu, bestValueGpu, randomGpu];
}

function getAmdGpus(gpus: Gpu[]) {
  const amdGpus = gpus;

  const bestPerformingGpus = amdGpus;

  const bestValueGpus = amdGpus;

  const bestPerformingGpu = bestPerformingGpus[0] || null;
  const bestValueGpu = bestValueGpus[0] || null;

  const randomGpu =
    bestPerformingGpus[
      Math.floor(Math.random() * Math.min(amdGpus.length - 1, 15))
    ];
  return [bestPerformingGpu, bestValueGpu, randomGpu];
}

export default HomePage;
