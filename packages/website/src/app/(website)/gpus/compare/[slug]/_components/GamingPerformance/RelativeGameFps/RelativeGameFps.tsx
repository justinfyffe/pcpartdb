import React, { FunctionComponent } from 'react';
import { RelativeGameFpsIntro } from './RelativeGameFpsIntro';
import { RelativeGameFpsTable } from './RelativeGameFpsTable';

export const RelativeGameFps: FunctionComponent = () => {
  return (
    <section className="flex-1">
      <h3 className="mb-1 font-semibold">Compare FPS</h3>
      <RelativeGameFpsIntro />
      <RelativeGameFpsTable />
    </section>
  );
};
