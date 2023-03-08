import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { ValueIntro } from './intro';
import { ValueTable } from './table';

export const RelativeValue: FunctionComponent = () => {
  const { gpu } = useContext(ViewPageContext);

  if (gpu.benchmarks?.valueScore?.value == null) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-0 font-semibold">Relative Value</h2>
      <ValueIntro />

      <section className="flex flex-wrap gap-8 mb-4">
        <ValueTable />
      </section>
    </section>
  );
};
