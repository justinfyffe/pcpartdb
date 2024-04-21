'use client';

import React, { FunctionComponent } from 'react';
import { RelativeGameCpfIntro } from './RelativeGameCpfIntro';
import { RelativeGameCpfTable } from './RelativeGameCpfTable';

export const RelativeGameCpf: FunctionComponent = () => {
  return (
    <section className="flex-1">
      <h3 className="mb-1 font-semibold">Compare Cost Per Frame</h3>
      <RelativeGameCpfIntro />
      <RelativeGameCpfTable />
    </section>
  );
};
