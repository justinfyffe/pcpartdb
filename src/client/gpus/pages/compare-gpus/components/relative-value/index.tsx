import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { ValueIntro } from './intro';
import { ValueTable } from './table';

export const RelativeValue: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (
    gpu1.benchmarks?.valueScore?.value == null &&
    gpu2.benchmarks?.valueScore?.value == null
  ) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-0 font-semibold">Relative Value</h2>
      <ValueIntro />
      <ValueTable className="mb-4" />
    </section>
  );
};
