import { formatProductName, GpuProduct } from '@pcpartdb/shared';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import { GameSelectionCarousel } from 'packages/website/src/app/_common/game/components/GameSelection/GameSelectionCarousel';
import React from 'react';
import { Contents } from '../Contents/Contents';
import { GameFps } from './GameFps/GameFps';
import { RelativeGameCpf } from './RelativeGameCpf/RelativeGameCpf';
import { RelativeGameFps } from './RelativeGameFps/RelativeGameFps';

interface GamingPerformanceProps {
  gpu: GpuProduct;
}

export function GamingPerformance(props: GamingPerformanceProps) {
  const { gpu } = props;

  const gpuName = formatProductName(gpu);
  const hasGamingPerformance = gpu.games != null && gpu.games.length > 0;
  const games = gpu.games?.map((game) => game?.game);

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="gaming-performance" menu={<Contents />}>
        Gaming Performance
      </SectionHeader>

      {hasGamingPerformance && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-0">
            <h3 className="mb-4 font-semibold">
              Select a game to view and compare FPS metrics
            </h3>
            <GameSelectionCarousel games={games} />
          </div>

          <GameFps product={gpu} games={games} />
          <div className="flex gap-6 md:flex-col md:gap-6">
            <RelativeGameFps />
            <RelativeGameCpf />
          </div>
        </div>
      )}

      {!hasGamingPerformance && (
        <div className="text-center py-8">
          Our database does not have gaming performance data for the {gpuName}.
        </div>
      )}
    </section>
  );
}
