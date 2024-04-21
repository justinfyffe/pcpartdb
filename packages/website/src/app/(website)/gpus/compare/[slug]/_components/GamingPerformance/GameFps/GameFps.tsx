import { Game } from '@pcpartdb/shared';
import { CompareSelectedGameFpsTabs } from 'packages/website/src/app/_common/game/components/SelectedGameFpsTable/CompareSelectedGameFpsTabs';
import React, { FunctionComponent } from 'react';
import { GameFpsIntro } from './GameFpsIntro';

interface GameFpsProps {
  products: Partial<Game>[];
  games: Partial<Game>[];
}

export const GameFps: FunctionComponent<GameFpsProps> = (
  props: GameFpsProps,
) => {
  const { products, games } = props;
  return (
    <section>
      <h3 className="mb-1 font-semibold">FPS Benchmarks</h3>
      <GameFpsIntro />
      <CompareSelectedGameFpsTabs products={products} games={games} credit />
      {/* <GameFpsTables credit /> */}
    </section>
  );
};
