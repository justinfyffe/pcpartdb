import {
  formatProductName,
  getGamesFromProducts,
  GpuProductComparison,
} from '@pcpartdb/shared';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import { GameSelectionCarousel } from 'packages/website/src/app/_common/game/components/GameSelection/GameSelectionCarousel';
import React from 'react';
import { Contents } from '../Contents/Contents';
import { GameFps } from './GameFps/GameFps';
import { RelativeGameCpf } from './RelativeGameCpf/RelativeGameCpf';
import { RelativeGameFps } from './RelativeGameFps/RelativeGameFps';

interface GamingPerformanceProps {
  comparison: GpuProductComparison;
}

export function GamingPerformance(props: GamingPerformanceProps) {
  const { comparison } = props;
  const [gpu1, gpu2] = comparison;

  const gpuName1 = formatProductName(gpu1);
  const gpuName2 = formatProductName(gpu2);
  const hasGamingPerformance =
    (gpu1.games != null && gpu1.games.length > 0) ||
    (gpu2.games != null && gpu2.games.length > 0);

  const games = getGamesFromProducts(comparison);

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

          <GameFps products={comparison} games={games} />
          <div className="flex gap-6 md:flex-col md:gap-6">
            <RelativeGameFps />
            <RelativeGameCpf />
          </div>
        </div>
      )}

      {!hasGamingPerformance && (
        <div className="text-center py-8">
          Our database does not have gaming performance data for the {gpuName1}{' '}
          or the {gpuName2}.
        </div>
      )}
    </section>
  );
}
