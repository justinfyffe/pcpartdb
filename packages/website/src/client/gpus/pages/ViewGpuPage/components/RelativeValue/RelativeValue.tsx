import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const { gpu } = useContext(ViewPageContext);

  const valueScore = gpu.chipset?.valueScore?.value || gpu.valueScore?.value;
  if (valueScore == null) {
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
