import { Game, Product } from '@pcpartdb/shared';
import { ViewSelectedGameFpsTable } from 'packages/website/src/app/_common/game/components/SelectedGameFpsTable/ViewSelectedGameFpsTable';
import React, { FunctionComponent } from 'react';
import { GameFpsIntro } from './GameFpsIntro';

interface GameFpsProps {
  product: Partial<Product>;
  games?: Partial<Game>[];
}

export const GameFps: FunctionComponent<GameFpsProps> = (
  props: GameFpsProps,
) => {
  const { product, games } = props;

  return (
    <section>
      <h3 className="mb-1 font-semibold">FPS Benchmarks</h3>
      <GameFpsIntro />
      <ViewSelectedGameFpsTable product={product} games={games} credit />
      {/* <GameFpsTables credit /> */}
    </section>
  );
};
